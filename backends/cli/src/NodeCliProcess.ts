import { spawn } from "node:child_process";

import { CliCommand } from "./CliCommand.js";
import { CliProcess } from "./CliProcess.js";
import { CliResult } from "./CliResult.js";

export class NodeCliProcess
implements CliProcess {

    async execute(
        command: CliCommand,
    ): Promise<CliResult> {

        return new Promise(
            (resolve, reject) => {

                const startedAt =
                    Date.now();

                console.debug(
                    "[CLI] process:start",
                    {
                        executable:
                            command.executable,

                        arguments:
                            [...command.arguments],

                        workingDirectory:
                            command.workingDirectory,

                        hasStandardInput:
                            Boolean(
                                command.standardInput,
                            ),
                    },
                );

                let child;

                try {

                    child =
                        spawn(

                            command.executable,

                            [...command.arguments],

                            {

                                cwd:
                                    command.workingDirectory,

                                env: {

                                    ...process.env,

                                    ...command.environment,

                                },

                                shell:
                                    false,

                            },

                        );

                }
                catch (error) {

                    console.error(
                        "[CLI] process:spawn-throw",
                        {
                            executable:
                                command.executable,

                            error:
                                error instanceof Error
                                    ? error.message
                                    : String(error),

                            durationMs:
                                Date.now() -
                                startedAt,
                        },
                    );

                    reject(
                        error,
                    );

                    return;

                }

                console.debug(
                    "[CLI] process:spawned",
                    {
                        executable:
                            command.executable,

                        pid:
                            child.pid,
                    },
                );

                let standardOutput =
                    "";

                let standardError =
                    "";

                let settled =
                    false;

                child.stdout.on(
                    "data",
                    data => {

                        const chunk =
                            data.toString();

                        standardOutput +=
                            chunk;

                    },
                );

                child.stderr.on(
                    "data",
                    data => {

                        const chunk =
                            data.toString();

                        standardError +=
                            chunk;

                    },
                );

                child.on(
                    "error",
                    error => {

                        if (settled) {

                            return;

                        }

                        settled =
                            true;

                        console.error(
                            "[CLI] process:error",
                            {
                                executable:
                                    command.executable,

                                pid:
                                    child.pid,

                                error:
                                    error instanceof Error
                                        ? error.message
                                        : String(error),

                                stdoutLength:
                                    standardOutput.length,

                                stderrLength:
                                    standardError.length,

                                durationMs:
                                    Date.now() -
                                    startedAt,
                            },
                        );

                        reject(
                            error,
                        );

                    },
                );

                child.on(
                    "close",
                    (
                        exitCode,
                        signal,
                    ) => {

                        if (settled) {

                            return;

                        }

                        settled =
                            true;

                        console.debug(
                            "[CLI] process:close",
                            {
                                executable:
                                    command.executable,

                                pid:
                                    child.pid,

                                exitCode,

                                signal,

                                stdoutLength:
                                    standardOutput.length,

                                stderrLength:
                                    standardError.length,

                                stdoutPreview:
                                    standardOutput.slice(
                                        0,
                                        500,
                                    ),

                                stderrPreview:
                                    standardError.slice(
                                        0,
                                        500,
                                    ),

                                durationMs:
                                    Date.now() -
                                    startedAt,
                            },
                        );

                        resolve({

                            exitCode:
                                exitCode ?? -1,

                            standardOutput,

                            standardError,

                        });

                    },
                );

                if (
                    command.standardInput
                ) {

                    console.debug(
                        "[CLI] stdin:write",
                        {
                            executable:
                                command.executable,

                            pid:
                                child.pid,

                            length:
                                command.standardInput.length,
                        },
                    );

                    child.stdin.write(
                        command.standardInput,
                    );

                }

                child.stdin.end();

            },
        );

    }

}
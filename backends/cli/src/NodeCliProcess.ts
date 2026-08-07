import { spawn } from "node:child_process";

import { CliCommand } from "./CliCommand.js";
import { CliProcess } from "./CliProcess.js";
import { CliResult } from "./CliResult.js";

export class NodeCliProcess
implements CliProcess {

    async execute(
        command: CliCommand,
    ): Promise<CliResult> {

        return new Promise((resolve, reject) => {

            const child = spawn(

                command.executable,

                [...command.arguments],

                {

                    cwd: command.workingDirectory,

                    env: {

                        ...process.env,

                        ...command.environment,

                    },

                    shell: false,

                },

            );

            let standardOutput = "";

            let standardError = "";

            child.stdout.on(

                "data",

                data => {

                    standardOutput += data.toString();

                },

            );

            child.stderr.on(

                "data",

                data => {

                    standardError += data.toString();

                },

            );

            child.on(

                "error",

                reject,

            );

            child.on(

                "close",

                exitCode => {

                    resolve({

                        exitCode: exitCode ?? -1,

                        standardOutput,

                        standardError,

                    });

                },

            );

            if (command.standardInput) {

                child.stdin.write(

                    command.standardInput,

                );

            }

            child.stdin.end();

        });

    }

}
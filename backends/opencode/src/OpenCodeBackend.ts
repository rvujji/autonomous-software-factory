import {
    BackendCapability,
    BackendConfiguration,
    BackendResult,
    BackendTask,
} from "@engineering/backend-shared";

import {
    CliBackend,
    CliProcess,
} from "@engineering/backend-cli";

import { randomUUID } from "node:crypto";

import { OpenCodeCommandBuilder } from "./OpenCodeCommandBuilder.js";
import { OpenCodeConfiguration } from "./OpenCodeConfiguration.js";
import { OpenCodeResultMapper } from "./OpenCodeResultMapper.js";

export class OpenCodeBackend
extends CliBackend {

    readonly name = "OpenCode";

    readonly version = "1.0.0";

    readonly capabilities:
        readonly BackendCapability[] = [

            BackendCapability.FILESYSTEM,

            BackendCapability.CODE_GENERATION,

            BackendCapability.CODE_ANALYSIS,

            BackendCapability.DOCUMENT_GENERATION,

            BackendCapability.COMMAND_EXECUTION,

            BackendCapability.TOOL_USE,

        ];

    private readonly commandBuilder:
        OpenCodeCommandBuilder;

    private readonly resultMapper =
        new OpenCodeResultMapper();

    constructor(

        process: CliProcess,

        configuration: OpenCodeConfiguration,

    ) {

        super(process);

        this.commandBuilder =
            new OpenCodeCommandBuilder(
                configuration,
            );

    }

    override async execute(

        task: BackendTask,

        configuration?: BackendConfiguration,

    ): Promise<BackendResult> {

        console.debug(
            "[OPENCODE] execute:start",
            {
                task:
                    task.name,

                taskId:
                    task.id,

                inputCount:
                    task.inputs.length,

                promptInputChars:
                    task.inputs
                        .reduce(
                            (total, input) => {

                                if (
                                    input.source.kind !== "CONTENT"
                                ) {

                                    return total;

                                }

                                return total +
                                    String(
                                        input.source.content,
                                    ).length;

                            },
                            0,
                        ),
            },
        );
        const command =
            this.commandBuilder.build(
                task,
                configuration,
            );
        console.debug(
            "[OPENCODE] command:built",
            {
                task: task.name,
                executable: command.executable,
                arguments: command.arguments,
                workingDirectory: command.workingDirectory,
            },
        );
        console.debug("[OPENCODE] command:json",JSON.stringify(command),);
        const startedAt = Date.now();
        const result =
            await this.process.execute(
                command,
            );
        console.debug(
            "[OPENCODE] process:completed",
            {
                task: task.name,
                taskId: task.id,
                durationMs: Date.now() - startedAt,
            },
        );
        console.debug(
            "[OPENCODE] execute:process-returned",
            {
                task:
                    task.name,

                taskId:
                    task.id,

                exitCode:
                    result.exitCode,

                stdoutLength:
                    result.standardOutput.length,

                stderrLength:
                    result.standardError.length,
            },
        );
        return this.resultMapper.map(

            randomUUID(),

            result,

        );

    }

}
import {
    BackendCapability,
    BackendConfiguration,
    BackendResult,
    BackendStatus,
    BackendTask,
} from "@engineering/backend-shared";

import {
    CliBackend,
    CliProcess,
} from "@engineering/backend-cli";

import {
    randomUUID,
} from "node:crypto";

import {
    OllamaCommandBuilder,
} from "./OllamaCommandBuilder.js";

import {
    OllamaConfiguration,
} from "./OllamaConfiguration.js";

import {
    OllamaResultMapper,
} from "./OllamaResultMapper.js";

export class OllamaBackend
extends CliBackend {

    readonly name =
        "Ollama";

    readonly version =
        "1.0.0";

    readonly capabilities:
        readonly BackendCapability[] = [

            BackendCapability.CODE_GENERATION,

            BackendCapability.CODE_ANALYSIS,

            BackendCapability.DOCUMENT_GENERATION,

        ];

    private readonly commandBuilder:
        OllamaCommandBuilder;

    private readonly resultMapper =
        new OllamaResultMapper();

    constructor(

        process: CliProcess,

        configuration: OllamaConfiguration,

    ) {

        super(
            process,
        );

        this.commandBuilder =
            new OllamaCommandBuilder(
                configuration,
            );

    }

    override async execute(

        task: BackendTask,

        configuration?:
            BackendConfiguration,

        model?: string,

    ): Promise<BackendResult> {

        const command =
            this.commandBuilder.build(
                task,
                configuration,
                model,
            );

        console.debug(
            "[OLLAMA] execution:start",
            {
                task:
                    task.name,

                taskId:
                    task.id,

                model:
                    model ?? "default",

                executable:
                    command.executable,

                arguments:
                    command.arguments,

                workingDirectory:
                    command.workingDirectory,
            },
        );

        const startedAt =
            Date.now();

        try {

            const result =
                await this.process.execute(
                    command,
                );

            console.debug(
                "[OLLAMA] execution:completed",
                {
                    task:
                        task.name,

                    taskId:
                        task.id,

                    model:
                        model ?? "default",

                    durationMs:
                        Date.now() -
                        startedAt,

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
        catch (error) {

            return {

                contractVersion:
                    "1.0",

                executionId:
                    randomUUID(),

                status:
                    BackendStatus.FAILED,

                outputs: [],

                logs: [],

                toolCalls: [],

                toolResults: [],

                error: {

                    code:
                        "OLLAMA_EXECUTION_FAILED",

                    message:
                        error instanceof Error
                            ? error.message
                            : "Ollama execution failed.",

                    cause:
                        error,

                },

            };

        }

    }

}
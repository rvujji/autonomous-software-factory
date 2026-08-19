import {
    BackendConfiguration,
    BackendInput,
    BackendInputSource,
    BackendTask,
} from "@engineering/backend-shared";

import { CliCommand } from "@engineering/backend-cli";

import { OpenCodeConfiguration } from "./OpenCodeConfiguration.js";

export class OpenCodeCommandBuilder {

    constructor(
        private readonly configuration: OpenCodeConfiguration,
    ) {}

    build(
        task: BackendTask,
        configuration?: BackendConfiguration,
    ): CliCommand {

        const prompt =
            this.buildPrompt(task);

        const argumentsList: string[] = [

            "run",

            prompt,

        ];

        const fileInputs =
            this.findFileInputs(
                task.inputs,
            );

        for (
            const fileInput
            of fileInputs
        ) {

            argumentsList.push(
                "--file",
                fileInput.path,
            );

        }

        const format =
            this.configuration.format ?? "json";

        argumentsList.push(
            "--format",
            format,
        );

        if (configuration?.workingDirectory) {

            argumentsList.push(
                "--dir",
                configuration.workingDirectory,
            );

        }

        return {

            executable:
                this.configuration.executable,

            arguments:
                argumentsList,

            ...(configuration?.workingDirectory && {

                workingDirectory:
                    configuration.workingDirectory,

            }),

            ...(configuration?.environment && {

                environment:
                    configuration.environment,

            }),

        };

    }

    private findFileInputs(
        inputs: readonly BackendInput[],
    ): readonly Extract<
        BackendInputSource,
        { readonly kind: "FILE" }
    >[] {

        const sources: Extract<
            BackendInputSource,
            { readonly kind: "FILE" }
        >[] = [];

        for (
            const input
            of inputs
        ) {

            if (
                input.source.kind === "FILE"
            ) {

                sources.push(
                    input.source,
                );

            }

        }

        return sources;

    }

    private buildPrompt(
        task: BackendTask,
    ): string {

        const lines: string[] = [];

        lines.push(
            `Objective: ${task.objective}`,
        );

        lines.push("");

        if (task.instructions.length > 0) {

            lines.push(
                "Instructions:",
            );

            for (
                const instruction
                of task.instructions
            ) {

                lines.push(
                    `- ${instruction}`,
                );

            }

            lines.push("");

        }

        if (task.inputs.length > 0) {

            lines.push(
                "Inputs:",
            );

            for (
                const input
                of task.inputs
            ) {

                lines.push(
                    `- ${input.name}`,
                );

                if (
                    input.source.kind === "CONTENT"
                ) {

                    lines.push("");

                    lines.push(
                        "Content:",
                    );

                    lines.push(
                        String(input.source.content),
                    );

                }

            }

            lines.push("");

        }

        if (
            task.expectedOutputs.length > 0
        ) {

            lines.push(
                "Expected outputs:",
            );

            for (
                const output
                of task.expectedOutputs
            ) {

                lines.push(
                    `- ${output.name}: ${output.type}`,
                );

            }

            lines.push("");

        }

        return lines.join("\n");

    }

}
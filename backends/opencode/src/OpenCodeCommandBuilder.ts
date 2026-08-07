import {
    BackendConfiguration,
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

        const prompt = this.buildPrompt(task);

        return {

            executable: this.configuration.executable,

            arguments: [
                ...this.configuration.arguments,
            ],

            ...(configuration?.workingDirectory && {
                workingDirectory: configuration.workingDirectory,
            }),

            ...(configuration?.environment && {
                environment: configuration.environment,
            }),

            standardInput: prompt,

        };

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

            lines.push("Instructions:");

            for (const instruction of task.instructions) {

                lines.push(
                    `- ${instruction}`,
                );

            }

            lines.push("");

        }

        lines.push("Inputs:");

        for (const input of task.inputs) {

            lines.push(
                `- ${input.name}`,
            );

        }

        return lines.join("\n");

    }

}
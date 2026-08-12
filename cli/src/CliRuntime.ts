import {
    Platform,
} from "@engineering/platform";

import {
    StartExecutionRequest,
} from "@engineering/shared";

import {
    CliCommand,
} from "./CliCommand.js";

import {
    readFile,
} from "node:fs/promises";

export class CliRuntime {

    constructor(
        private readonly platform: Platform,
    ) {}

    async execute(
        command: CliCommand,
    ): Promise<unknown> {

        switch (command.kind) {

            case "BACKEND_LIST":

                return this.platform.backends.list();

            case "ENGINE_LIST":

                return this.platform.engines.list();

            case "PIPELINE_LIST":

                return this.platform.pipelines.list();

            case "EXECUTE": {

                const content =
                    await readFile(
                        command.inputFile,
                        "utf8",
                    );

                const sourceArtifact =
                    await this.platform.artifacts.create({

                        name:
                            command.inputFile,

                        type:
                            "REQUIREMENTS_SOURCE",

                        payload:
                            content,

                    });

                const request:
                    StartExecutionRequest = {

                    pipeline:
                        command.pipeline,

                    artifacts: [
                        sourceArtifact,
                    ],

                };

                return this.platform.executions.start(
                    request,
                );

            }

        }

    }

}
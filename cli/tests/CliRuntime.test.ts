import {
    describe,
    expect,
    it,
} from "vitest";

import {
    CliRuntime,
} from "../src/CliRuntime.js";

import {
    CliCommand,
} from "../src/CliCommand.js";

function createPlatform() {

    return {

        backends: {

            async list() {

                return [

                    {

                        name: "test-backend",

                        version: "1.0.0",

                        capabilities: [],

                        async execute() {

                            throw new Error(
                                "Not expected.",
                            );

                        },

                    },

                ];

            },

        },

        engines: {

            async list() {

                return [];

            },

        },

        pipelines: {

            async list() {

                return [];

            },

        },

        executions: {

            async start(request: any) {

                return {

                    id: "execution-1",

                    pipeline:
                        request.pipeline,

                    state: "COMPLETED",

                    artifacts: [],

                    metadata: {

                        startedAt:
                            new Date(),

                    },

                };

            },

        },

        artifacts: {

        async create(request: any) {

            return {

                id: "artifact-1",

                name:
                    request.name,

                type:
                    request.type,

                version: 1,

                state: "CREATED",

                metadata: {

                    createdAt:
                        new Date(),

                },

                parents: [],

                payload:
                    request.payload,

            };

        },

    },

    } as any;

}

describe(
    "CliRuntime",
    () => {

        it(
            "lists backends",
            async () => {

                const runtime =
                    new CliRuntime(
                        createPlatform(),
                    );

                const command:
                    CliCommand = {

                    kind:
                        "BACKEND_LIST",

                };

                const result =
                    await runtime.execute(
                        command,
                    );

                expect(
                    result,
                ).toHaveLength(1);

            },
        );

        it(
            "starts a pipeline execution",
            async () => {

                const runtime =
                    new CliRuntime(
                        createPlatform(),
                    );

                const result =
                    await runtime.execute({

                        kind:
                            "EXECUTE",

                        pipeline:
                            "engineering.requirements",

                        inputFile:
                            new URL(
                                "./requirements.md",
                                import.meta.url,
                            ).pathname,

                    });

                expect(
                    result,
                ).toMatchObject({

                    pipeline:
                        "engineering.requirements",

                });

            },
        );

    },
);
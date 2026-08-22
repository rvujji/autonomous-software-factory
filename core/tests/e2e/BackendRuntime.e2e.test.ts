import {
    describe,
    expect,
    it,
} from "vitest";

import {
    Backend,
    BackendCapability,
    BackendResult,
    BackendStatus,
    BackendTask,
} from "@engineering/backend-shared";

import {
    BackendRuntime,
    InMemoryBackendRegistry,
} from "../../src/runtime/backend/index.js";

class E2EBackend
implements Backend {

    readonly name =
        "e2e-backend";

    readonly version =
        "1.0.0";

    readonly capabilities:
        readonly BackendCapability[] = [

            BackendCapability.DOCUMENT_GENERATION,

        ];

    receivedModel:
        string | undefined;

    async execute(
        task: BackendTask,
        configuration?: {
            readonly timeoutMs?: number;
            readonly workingDirectory?: string;
            readonly environment?: Readonly<Record<string, string>>;
            readonly retryCount?: number;
            readonly stream?: boolean;
            readonly approvalRequired?: boolean;
        },
        model?: string,
    ): Promise<BackendResult> {

        this.receivedModel =
            model;

        return {

            contractVersion:
                "1.0",

            executionId:
                `execution-${task.id}`,

            status:
                BackendStatus.SUCCEEDED,

            outputs: [

                {

                    kind:
                        "INLINE",

                    content:
                        `Executed: ${task.objective}`,

                },

            ],

            logs: [],

            toolCalls: [],

            toolResults: [],

        };

    }

}

describe(
    "BackendRuntime E2E",
    () => {

        it(
            "registers, resolves, and executes a backend",
            async () => {

                const registry =
                    new InMemoryBackendRegistry();

                const runtime =
                    new BackendRuntime(
                        registry,
                    );

                const backend =
                    new E2EBackend();

                await runtime.register(
                    backend,
                );

                expect(
                    await registry.has(
                        "e2e-backend",
                    ),
                ).toBe(true);

                const resolved =
                    await runtime.resolve(
                        "e2e-backend",
                    );

                expect(
                    resolved,
                ).toBe(
                    backend,
                );

                const task: BackendTask = {

                    contractVersion:
                        "1.0",

                    id:
                        "backend-runtime-e2e",

                    name:
                        "Backend Runtime E2E",

                    objective:
                        "Generate a backend execution result.",

                    instructions: [],

                    inputs: [],

                    context: [],

                    expectedOutputs: [],

                    metadata: {},

                };

                const result =
                    await runtime.execute(
                        "e2e-backend",
                        task,
                    );

                expect(
                    result.status,
                ).toBe(
                    BackendStatus.SUCCEEDED,
                );

                expect(
                    result.executionId,
                ).toBe(
                    "execution-backend-runtime-e2e",
                );

                expect(
                    result.outputs,
                ).toHaveLength(1);

                expect(
                    result.outputs[0]?.kind,
                ).toBe(
                    "INLINE",
                );

            },
        );

        it(
            "propagates the execution candidate model to the backend",
            async () => {

                const registry =
                    new InMemoryBackendRegistry();

                const runtime =
                    new BackendRuntime(
                        registry,
                    );

                const backend =
                    new E2EBackend();

                await runtime.register(
                    backend,
                );

                const task: BackendTask = {

                    contractVersion:
                        "1.0",

                    id:
                        "backend-model-selection-e2e",

                    name:
                        "Backend Model Selection E2E",

                    objective:
                        "Verify model selection propagation.",

                    instructions: [],

                    inputs: [],

                    context: [],

                    expectedOutputs: [],

                    metadata: {},

                };

                const result =
                    await runtime.executeCandidates(
                        [

                            {

                                backend:
                                    "e2e-backend",

                                model:
                                    "test/model-a",

                            },

                        ],

                        task,
                    );

                expect(
                    result.status,
                ).toBe(
                    BackendStatus.SUCCEEDED,
                );

                expect(
                    backend.receivedModel,
                ).toBe(
                    "test/model-a",
                );

            },
        );

    },
);
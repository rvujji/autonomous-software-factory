import {
    describe,
    expect,
    it,
} from "vitest";

import {
    BackendStatus,
    BackendTask,
} from "@engineering/backend-shared";

import {
    DefaultPlatform,
} from "../../src/index.js";

describe(
    "Platform Backend Execution E2E",
    () => {

        it(
            "executes a real engineering task through the registered OpenCode backend",
            async () => {

                const platform =
                    await DefaultPlatform.create();

                const backend =
                    await platform.backends.resolve(
                        "OpenCode",
                    );

                expect(
                    backend.name,
                ).toBe(
                    "OpenCode",
                );

                expect(
                    backend.capabilities.length,
                ).toBeGreaterThan(0);

                const task: BackendTask = {

                    contractVersion:
                        "1.0",

                    id:
                        "platform-backend-e2e",

                    name:
                        "Platform Backend Execution E2E",

                    objective:
                        "Respond with exactly the text PLATFORM_BACKEND_OK.",

                    instructions: [

                        "Do not create or modify any files.",

                        "Do not execute commands.",

                        "Respond with exactly the requested text.",

                    ],

                    inputs: [],

                    context: [],

                    expectedOutputs: [],

                    metadata: {},

                };

                const result =
                    await platform.backends.execute(

                        "OpenCode",

                        task,

                    );

                expect(
                    result.status,
                ).toBe(
                    BackendStatus.SUCCEEDED,
                );

                expect(
                    result.outputs.length,
                ).toBeGreaterThan(0);

                const output =
                    result.outputs[0];

                expect(
                    output,
                ).toBeDefined();

                if (
                    output?.kind === "INLINE"
                ) {

                    expect(
                        output.content,
                    ).toContain(
                        "PLATFORM_BACKEND_OK",
                    );

                }
                else {

                    throw new Error(
                        "Expected OpenCode to return an INLINE output.",
                    );

                }

            },

        );

    },
);
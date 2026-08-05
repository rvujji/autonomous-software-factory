import { describe, expect, it } from "vitest";

import { Artifact, ArtifactState }
    from "../../../shared/src/artifact/index.js";

import { EngineRuntime }
    from "../../src/runtime/engine/EngineRuntime.js";

import { InMemoryEngineRegistry }
    from "../../src/runtime/engine/InMemoryEngineRegistry.js";

import { FakeEngine }
    from "../fakes/FakeEngine.js";

describe("EngineRuntime", () => {

    it("executes a registered engine", async () => {

        const registry =
            new InMemoryEngineRegistry();

        await registry.register(
            new FakeEngine(),
        );

        const runtime =
            new EngineRuntime(registry);

        const artifact: Artifact = {

            id: "1",

            name: "test",

            type: "DOCUMENT",

            version: 1,

            state: "CREATED" as ArtifactState,

            metadata: {

                createdAt: new Date(),

            },

            parents: [],

            payload: {},

        };

        const result =
            await runtime.execute(

                "fake",

                {},

                {

                    input: {

                        artifacts: [
                            artifact,
                        ],

                    },

                },

            );

        expect(
            result.output.artifacts,
        ).toEqual([
            artifact,
        ]);

    });

});
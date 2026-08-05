import { describe, expect, it } from "vitest";

import { Artifact, ArtifactState } from "../../../shared/src/artifact/index.js";

import { PipelineRuntime } from "../../src/runtime/pipeline/PipelineRuntime.js";
import { InMemoryPipelineRegistry } from "../../src/runtime/pipeline/InMemoryPipelineRegistry.js";

import { FakePipeline } from "../fakes/FakePipeline.js";

describe("PipelineRuntime", () => {

    it("executes a registered pipeline", async () => {

        const registry = new InMemoryPipelineRegistry();

        await registry.register(
            new FakePipeline(),
        );

        const runtime = new PipelineRuntime(
            registry,
        );

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

        const result = await runtime.execute(

            "fake",

            {},

            {

                artifacts: [
                    artifact,
                ],

            },

        );

        expect(result.artifacts)

    });

});
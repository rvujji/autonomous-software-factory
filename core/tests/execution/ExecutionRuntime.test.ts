import { describe, expect, it } from "vitest";

import { Artifact, ArtifactState } from "../../../shared/src/artifact/index.js";

import { ExecutionRuntime } from "../../src/runtime/execution/ExecutionRuntime.js";
import { InMemoryExecutionRepository } from "../../src/runtime/execution/InMemoryExecutionRepository.js";

import { PipelineRuntime } from "../../src/runtime/pipeline/PipelineRuntime.js";
import { InMemoryPipelineRegistry } from "../../src/runtime/pipeline/InMemoryPipelineRegistry.js";

import { FakePipeline } from "../fakes/FakePipeline.js";
import { ThrowingPipeline } from "../fakes/ThrowingPipeline.js";
import { FakeClock } from "../fakes/FakeClock.js";
import { FakeIdentifierGenerator } from "../fakes/FakeIdentifierGenerator.js";

describe("ExecutionRuntime", () => {

    function createArtifact(): Artifact {

        return {

            id: "artifact-1",

            name: "Requirements",

            type: "DOCUMENT",

            version: 1,

            state: "CREATED" as ArtifactState,

            metadata: {

                createdAt: new Date(),

            },

            parents: [],

            payload: {},

        };

    }

    it("starts and completes an execution", async () => {

        const registry =
            new InMemoryPipelineRegistry();

        await registry.register(
            new FakePipeline(),
        );

        const runtime =
            new ExecutionRuntime(

                new PipelineRuntime(
                    registry,
                ),

                new InMemoryExecutionRepository(),

                new FakeIdentifierGenerator(),

                new FakeClock(),

            );

        const execution =
            await runtime.start({

                pipeline: "fake",

                artifacts: [

                    createArtifact(),

                ],

            });

        expect(
            execution.state,
        ).toBe("COMPLETED");

        expect(
            execution.pipeline,
        ).toBe("fake");

        expect(
            execution.artifacts,
        ).toHaveLength(1);

    });

    it("marks execution as failed when pipeline throws", async () => {

        const registry =
            new InMemoryPipelineRegistry();

        await registry.register(
            new ThrowingPipeline(),
        );

        const runtime =
            new ExecutionRuntime(

                new PipelineRuntime(
                    registry,
                ),

                new InMemoryExecutionRepository(),

                new FakeIdentifierGenerator(),

                new FakeClock(),

            );

        await expect(

            runtime.start({

                pipeline: "throwing",

                artifacts: [

                    createArtifact(),

                ],

            }),

        ).rejects.toThrow();

    });

});
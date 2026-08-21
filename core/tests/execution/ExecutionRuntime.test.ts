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
import {InMemoryEventPublisher,} from "../../src/runtime/foundation/InMemoryEventPublisher.js";

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

        const events =
            new InMemoryEventPublisher();

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

                events,

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

        const repository =
            new InMemoryExecutionRepository();

        const events =
            new InMemoryEventPublisher();

        const runtime =
            new ExecutionRuntime(

                new PipelineRuntime(
                    registry,
                ),

                repository,

                new FakeIdentifierGenerator(),

                new FakeClock(),

                events,

            );

        await expect(

            runtime.start({

                pipeline: "throwing",

                artifacts: [

                    createArtifact(),

                ],

            }),

        ).rejects.toThrow();

        //
        // Execution must be persisted as FAILED
        //

        const execution =
            await repository.get(
                "artifact-001",
            );

        expect(
            execution,
        ).toBeDefined();

        expect(
            execution?.state,
        ).toBe(
            "FAILED",
        );

        expect(
            execution?.metadata.completedAt,
        ).toBeInstanceOf(
            Date,
        );

        expect(
            execution?.metadata.durationMs,
        ).toBeGreaterThanOrEqual(
            0,
        );

        //
        // Execution failure event must be published
        //

        const publishedEvents =
            events.list();

        const failedEvent =
            publishedEvents.find(
                event =>
                    event.type ===
                    "EXECUTION_FAILED",
            );

        expect(
            failedEvent,
        ).toBeDefined();

        expect(
            failedEvent?.executionId,
        ).toBe(
            "artifact-001",
        );

        expect(
            failedEvent?.component,
        ).toBe(
            "ExecutionRuntime",
        );

    });

});
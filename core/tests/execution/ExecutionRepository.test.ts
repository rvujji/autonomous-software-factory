import { describe, expect, it } from "vitest";

import { Execution } from "../../../shared/src/execution/index.js";

import { InMemoryExecutionRepository } from "../../src/runtime/execution/InMemoryExecutionRepository.js";

describe("InMemoryExecutionRepository", () => {

    function createExecution(
        overrides: Partial<Execution> = {},
    ): Execution {

        return {

            id: "execution-1",

            pipeline: "fake",

            state: "PENDING",

            artifacts: [],

            metadata: {

                startedAt: new Date(),

            },

            ...overrides,

        };

    }

    it("creates an execution", async () => {

        const repository = new InMemoryExecutionRepository();

        const execution = createExecution();

        await repository.create(execution);

        expect(
            await repository.get(execution.id),
        ).toEqual(execution);

    });

    it("updates an execution", async () => {

        const repository = new InMemoryExecutionRepository();

        const execution = createExecution();

        await repository.create(execution);

        const updated: Execution = {

            ...execution,

            state: "COMPLETED",

        };

        await repository.update(updated);

        expect(
            await repository.get(updated.id),
        ).toEqual(updated);

    });

    it("returns undefined for unknown execution", async () => {

        const repository = new InMemoryExecutionRepository();

        expect(
            await repository.get("unknown"),
        ).toBeUndefined();

    });

    it("lists executions", async () => {

        const repository = new InMemoryExecutionRepository();

        await repository.create(
            createExecution({
                id: "1",
            }),
        );

        await repository.create(
            createExecution({
                id: "2",
            }),
        );

        expect(
            await repository.list(),
        ).toHaveLength(2);

    });

    it("finds executions by pipeline", async () => {

        const repository = new InMemoryExecutionRepository();

        await repository.create(
            createExecution({
                id: "1",
                pipeline: "pipeline-a",
            }),
        );

        await repository.create(
            createExecution({
                id: "2",
                pipeline: "pipeline-b",
            }),
        );

        const executions =
            await repository.findByPipeline(
                "pipeline-a",
            );

        expect(
            executions,
        ).toHaveLength(1);

        expect(
            executions[0]!.pipeline,
        ).toBe("pipeline-a");

    });

    it("finds executions by state", async () => {

        const repository = new InMemoryExecutionRepository();

        await repository.create(
            createExecution({
                id: "1",
                state: "COMPLETED",
            }),
        );

        await repository.create(
            createExecution({
                id: "2",
                state: "FAILED",
            }),
        );

        const executions =
            await repository.findByState(
                "FAILED",
            );

        expect(
            executions,
        ).toHaveLength(1);

        expect(
            executions[0]!.state,
        ).toBe("FAILED");

    });

    it("deletes an execution", async () => {

        const repository = new InMemoryExecutionRepository();

        const execution = createExecution();

        await repository.create(execution);

        await repository.delete(
            execution.id,
        );

        expect(
            await repository.get(
                execution.id,
            ),
        ).toBeUndefined();

    });

    it("throws on duplicate create", async () => {

        const repository = new InMemoryExecutionRepository();

        const execution = createExecution();

        await repository.create(execution);

        await expect(

            repository.create(execution),

        ).rejects.toThrow();

    });

    it("throws when updating unknown execution", async () => {

        const repository = new InMemoryExecutionRepository();

        await expect(

            repository.update(
                createExecution(),
            ),

        ).rejects.toThrow();

    });

});
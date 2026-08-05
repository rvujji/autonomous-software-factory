import {
    Execution,
    ExecutionState,
} from "../../../../shared/src/execution/index.js";

import { ExecutionRepository } from "./ExecutionRepository.js";

export class InMemoryExecutionRepository
implements ExecutionRepository {

    private readonly executions =
        new Map<string, Execution>();

    async create(
        execution: Execution,
    ): Promise<void> {

        if (this.executions.has(execution.id)) {
            throw new Error(
                `Execution '${execution.id}' already exists.`,
            );
        }

        this.executions.set(
            execution.id,
            execution,
        );

    }

    async update(
        execution: Execution,
    ): Promise<void> {

        if (!this.executions.has(execution.id)) {
            throw new Error(
                `Execution '${execution.id}' not found.`,
            );
        }

        this.executions.set(
            execution.id,
            execution,
        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        this.executions.delete(id);

    }

    async get(
        id: string,
    ): Promise<Execution | undefined> {

        return this.executions.get(id);

    }

    async list(): Promise<readonly Execution[]> {

        return [...this.executions.values()];

    }

    async findByPipeline(
        pipeline: string,
    ): Promise<readonly Execution[]> {

        return [...this.executions.values()]
            .filter(
                execution =>
                    execution.pipeline === pipeline,
            );

    }

    async findByState(
        state: ExecutionState,
    ): Promise<readonly Execution[]> {

        return [...this.executions.values()]
            .filter(
                execution =>
                    execution.state === state,
            );

    }

}
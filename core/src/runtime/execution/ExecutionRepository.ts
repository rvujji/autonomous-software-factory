import {
    Execution,
    ExecutionState,
} from "../../../../shared/src/execution/index.js";

export interface ExecutionRepository {

    create(
        execution: Execution,
    ): Promise<void>;

    update(
        execution: Execution,
    ): Promise<void>;

    delete(
        id: string,
    ): Promise<void>;

    get(
        id: string,
    ): Promise<Execution | undefined>;

    list(): Promise<readonly Execution[]>;

    findByPipeline(
        pipeline: string,
    ): Promise<readonly Execution[]>;

    findByState(
        state: ExecutionState,
    ): Promise<readonly Execution[]>;

}
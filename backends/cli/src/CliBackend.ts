import {
    Backend,
    BackendConfiguration,
    BackendResult,
    BackendTask,
} from "@engineering/backend-shared";

export abstract class CliBackend
implements Backend {

    abstract readonly name: string;

    abstract readonly version: string;

    abstract execute(
        task: BackendTask,
        configuration?: BackendConfiguration,
    ): Promise<BackendResult>;

}
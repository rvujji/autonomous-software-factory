import { BackendConfiguration } from "./BackendConfiguration.js";
import { BackendResult } from "./BackendResult.js";
import { BackendTask } from "./BackendTask.js";

export interface Backend {

    readonly name: string;

    readonly version: string;

    execute(
        task: BackendTask,
        configuration?: BackendConfiguration
    ): Promise<BackendResult>;

}
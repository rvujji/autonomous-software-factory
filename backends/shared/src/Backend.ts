import { BackendCapability } from "./BackendCapability.js";
import { BackendConfiguration } from "./BackendConfiguration.js";
import { BackendResult } from "./BackendResult.js";
import { BackendTask } from "./BackendTask.js";

export interface Backend {

    readonly name: string;

    readonly version: string;

    readonly capabilities: readonly BackendCapability[];

    execute(
        task: BackendTask,
        configuration?: BackendConfiguration
    ): Promise<BackendResult>;

}
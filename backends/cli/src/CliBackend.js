import {

    Backend,
    BackendConfiguration,
    BackendResult,
    BackendTask,

} from "@engineering/backend-shared";

import { CliProcess } from "./CliProcess.js";

export abstract class CliBackend
implements Backend {

    abstract readonly name: string;

    abstract readonly version: string;

    protected constructor(

        protected readonly process: CliProcess,

    ) {}

    abstract execute(

        task: BackendTask,

        configuration?: BackendConfiguration,

    ): Promise<BackendResult>;

}
import {
    BackendExecutionCandidate,
} from "@engineering/backend-shared";

import {
    BackendExecutionPolicy,
} from "./BackendExecutionPolicy.js";

export class StaticBackendExecutionPolicy
implements BackendExecutionPolicy {

    constructor(

        readonly name: string,

        readonly candidates:
            readonly BackendExecutionCandidate[],

    ) {}

}
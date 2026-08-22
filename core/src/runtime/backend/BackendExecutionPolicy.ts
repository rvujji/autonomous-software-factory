import {
    BackendExecutionCandidate,
} from "@engineering/backend-shared";

export interface BackendExecutionPolicy {

    readonly name: string;

    readonly candidates:
        readonly BackendExecutionCandidate[];

}
import { BackendConfiguration } from "./BackendConfiguration.js";

export interface BackendExecutionCandidate {

    readonly backend: string;

    /**
     * Optional model selected for this execution attempt.
     *
     * Model selection belongs to the execution candidate,
     * not to a concrete backend implementation.
     */
    readonly model?: string;

    readonly configuration?: BackendConfiguration;

}
import { Artifact } from "../artifact/artifact.js";

export interface StartExecutionRequest {

    readonly pipeline: string;

    readonly artifacts: readonly Artifact[];

}
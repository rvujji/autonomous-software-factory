import { Artifact } from "../artifact/artifact.js";

export interface PipelineRequest {

    readonly artifacts: readonly Artifact[];

}
import { PipelineMetadata } from "./pipeline-metadata.js";
import { PipelineStep } from "./pipeline-step.js";
import { PipelineType } from "./pipeline-type.js";

export interface PipelineSpecification {

    readonly name: string;

    readonly displayName: string;

    readonly version: string;

    readonly type: PipelineType;

    readonly metadata: PipelineMetadata;

    readonly steps: readonly PipelineStep[];

}
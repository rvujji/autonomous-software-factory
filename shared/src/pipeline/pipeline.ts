import { PipelineContext } from "./pipeline-context.js";
import { PipelineRequest } from "./pipeline-request.js";
import { PipelineResult } from "./pipeline-result.js";
import { PipelineSpecification } from "./pipeline-specification.js";

export interface Pipeline {

    readonly specification: PipelineSpecification;

    execute(
        context: PipelineContext,
        request: PipelineRequest,
    ): Promise<PipelineResult>;

}
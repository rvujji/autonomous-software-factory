import {
    Pipeline,
    PipelineContext,
    PipelineRequest,
    PipelineResult,
    PipelineSpecification,
} from "../../../shared/src/pipeline/index.js";

export class FakePipeline implements Pipeline {

    readonly specification: PipelineSpecification = {

        name: "fake",

        displayName: "Fake Pipeline",

        version: "1.0.0",

        type: "BUILD",

        metadata: {

            version: "1.0.0",

        },

        steps: [],

    };

    async execute(
        context: PipelineContext,
        request: PipelineRequest,
    ): Promise<PipelineResult> {

        return {

            artifacts: request.artifacts,

        };

    }

}
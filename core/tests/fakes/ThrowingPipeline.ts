import {
    Pipeline,
    PipelineContext,
    PipelineRequest,
    PipelineResult,
    PipelineSpecification,
} from "../../../shared/src/pipeline/index.js";

export class ThrowingPipeline implements Pipeline {

    readonly specification: PipelineSpecification = {

        name: "throwing",

        displayName: "Throwing Pipeline",

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

        throw new Error(
            "Pipeline failed.",
        );

    }

}
import {
    Pipeline,
    PipelineContext,
    PipelineRequest,
    PipelineResult,
} from "../../../../shared/src/pipeline/index.js";

import { PipelineRegistry } from "./PipelineRegistry.js";

/**
 * Executes registered pipelines.
 */
export class PipelineRuntime {

    constructor(
        private readonly registry: PipelineRegistry,
    ) {}

    async execute(
        pipelineName: string,
        context: PipelineContext,
        request: PipelineRequest,
    ): Promise<PipelineResult> {

        const pipeline = await this.registry.get(
            pipelineName,
        );

        if (!pipeline) {
            throw new Error(
                `Pipeline '${pipelineName}' is not registered.`,
            );
        }

        return pipeline.execute(
            context,
            request,
        );

    }

    async exists(
        pipelineName: string,
    ): Promise<boolean> {

        return this.registry.exists(
            pipelineName,
        );

    }

    async list(): Promise<readonly Pipeline[]> {

        return this.registry.list();

    }

}
import {
    Pipeline,
    PipelineContext,
    PipelineRequest,
    PipelineResult,
} from "@engineering/shared/pipeline";

import {
    EventPublisher,
    Logger,
} from "@engineering/shared/foundation";

import { PipelineRegistry } from "./PipelineRegistry.js";

export class PipelineRuntime {

    constructor(

        private readonly registry:PipelineRegistry,
        private readonly events?:EventPublisher,
        private readonly logger?: Logger,
    ) {}

    async execute(
        pipelineName:string,
        context:PipelineContext,
        request:PipelineRequest,

    ): Promise<PipelineResult> {
        this.logger?.debug("Pipeline execution started.",{pipeline:pipelineName,},);
        const pipeline =
            await this.registry.get(
                pipelineName,
            );

        if (!pipeline) {

            throw new Error(
                `Pipeline '${pipelineName}' is not registered.`,
            );

        }

        const timestamp =
            new Date();

        this.events?.publish({

            type:
                "PIPELINE_STARTED",

            timestamp,

            component:
                "PipelineRuntime",

            ...(context.executionId && {

                executionId:
                    context.executionId,

            }),

            data: {

                pipeline:
                    pipelineName,

            },

        });

        try {

            const result =
                await pipeline.execute(
                    context,
                    request,
                );

            this.events?.publish({

                type:
                    "PIPELINE_COMPLETED",

                timestamp:
                    new Date(),

                component:
                    "PipelineRuntime",

                ...(context.executionId && {

                    executionId:
                        context.executionId,

                }),

                data: {

                    pipeline:
                        pipelineName,

                },

            });
            this.logger?.debug("Pipeline execution completed.",{pipeline:pipelineName,},);
            return result;

        }
        catch (error) {
            this.logger?.error("Pipeline execution failed.",
                {
                    pipeline:pipelineName,
                    executionId:context.executionId,
                    error:error instanceof Error? error.message: String(error),
                },
            );
            this.events?.publish({

                type:
                    "PIPELINE_FAILED",

                timestamp:
                    new Date(),

                component:
                    "PipelineRuntime",

                ...(context.executionId && {

                    executionId:
                        context.executionId,

                }),

                data: {

                    pipeline:
                        pipelineName,

                    error:
                        error instanceof Error
                            ? error.message
                            : String(error),

                },

            });

            throw error;

        }

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
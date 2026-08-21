import {
    Pipeline,
    PipelineContext,
    PipelineRequest,
    PipelineResult,
} from "@engineering/shared/pipeline";

import {
    EventPublisher,
    Logger,
    PlatformError,
} from "@engineering/shared/foundation";

import { PipelineRegistry } from "./PipelineRegistry.js";

export class PipelineRuntime {

    constructor(

        private readonly registry:PipelineRegistry,
        private readonly events?:EventPublisher,
        private readonly logger?: Logger,
    ) {}

    async execute(
        pipelineName: string,
        context: PipelineContext,
        request: PipelineRequest,

    ): Promise<PipelineResult> {

        const startedAt =
            Date.now();

        this.logger?.debug(
            "Pipeline execution started.",
            {
                pipeline:
                    pipelineName,

                executionId:
                    context.executionId,
            },
        );

        let pipeline;

        try {

            pipeline =
                await this.registry.get(
                    pipelineName,
                );

        }
        catch (error) {

            const platformError =
                error instanceof PlatformError
                    ? error
                    : new PlatformError(
                        "PIPELINE_RESOLUTION_FAILED",
                        `Pipeline '${pipelineName}' could not be resolved.`,
                        {
                            component:
                                "PipelineRuntime",

                            details: {
                                pipeline:
                                    pipelineName,

                                executionId:
                                    context.executionId,
                            },

                            cause:
                                error,
                        },
                    );

            this.logger?.error(
                "Pipeline resolution failed.",
                {
                    pipeline:
                        pipelineName,

                    executionId:
                        context.executionId,

                    code:
                        platformError.code,

                    error:
                        platformError.message,
                },
            );

            throw platformError;

        }

        if (!pipeline) {

            const error =
                new PlatformError(
                    "PIPELINE_NOT_FOUND",
                    `Pipeline '${pipelineName}' is not registered.`,
                    {
                        component:
                            "PipelineRuntime",

                        details: {
                            pipeline:
                                pipelineName,

                            executionId:
                                context.executionId,
                        },
                    },
                );

            this.logger?.error(
                "Pipeline not found.",
                {
                    pipeline:
                        pipelineName,

                    executionId:
                        context.executionId,

                    code:
                        error.code,

                    error:
                        error.message,
                },
            );

            throw error;

        }

        this.events?.publish({

            type:
                "PIPELINE_STARTED",

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

            this.logger?.debug(
                "Pipeline execution completed.",
                {
                    pipeline:
                        pipelineName,

                    executionId:
                        context.executionId,

                    durationMs:
                        Date.now() -
                        startedAt,
                },
            );

            return result;

        }
        catch (error) {

            const platformError =
                error instanceof PlatformError
                    ? error
                    : new PlatformError(
                        "PIPELINE_EXECUTION_FAILED",
                        `Pipeline '${pipelineName}' execution failed.`,
                        {
                            component:
                                "PipelineRuntime",

                            details: {
                                pipeline:
                                    pipelineName,

                                executionId:
                                    context.executionId,
                            },

                            cause:
                                error,
                        },
                    );

            this.logger?.error(
                "Pipeline execution failed.",
                {
                    pipeline:
                        pipelineName,

                    executionId:
                        context.executionId,

                    code:
                        platformError.code,

                    error:
                        platformError.message,

                    durationMs:
                        Date.now() -
                        startedAt,
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
                        platformError.message,

                },

            });

            throw platformError;

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
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

        private readonly registry:
            PipelineRegistry,

        private readonly events?:
            EventPublisher,

        private readonly logger?:
            Logger,

    ) {}

    async execute(

        pipelineName:
            string,

        context:
            PipelineContext,

        request:
            PipelineRequest,

    ): Promise<PipelineResult> {

        const startedAt =
            Date.now();

        let pipeline: Pipeline | undefined;

        try {

            pipeline =
                await this.registry.get(
                    pipelineName,
                );

            if (!pipeline) {

                throw new PlatformError(
                    "PIPELINE_NOT_FOUND",
                    `Pipeline '${pipelineName}' is not registered.`,
                    {
                        component:
                            "PipelineRuntime",

                        details: {
                            pipeline:
                                pipelineName,
                        },
                    },
                );

            }

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

        this.logger?.debug(
            "Pipeline execution started.",
            {
                pipeline:
                    pipelineName,

                executionId:
                    context.executionId,
            },
        );

        const startedAtTimestamp =
            new Date();

        this.events?.publish({

            type:
                "PIPELINE_STARTED",

            timestamp:
                startedAtTimestamp,

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

            const completedAt =
                new Date();

            this.events?.publish({

                type:
                    "PIPELINE_COMPLETED",

                timestamp:
                    completedAt,

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

                    artifactCount:
                        result.artifacts?.length ?? 0,
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

                    code:
                        platformError.code,

                },

            });

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
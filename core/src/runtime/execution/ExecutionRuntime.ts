import {
    Execution,
    StartExecutionRequest,
} from "@engineering/shared/execution";

import {
    Clock,
} from "../foundation/Clock.js";

import {
    EventPublisher,
    IdentifierGenerator,
    Logger,
    PlatformError,
} from "@engineering/shared/foundation";

import { PipelineRuntime } from "../pipeline/PipelineRuntime.js";
import { ExecutionRepository } from "./ExecutionRepository.js";

export class ExecutionRuntime {

    constructor(

        private readonly pipelineRuntime:
            PipelineRuntime,

        private readonly repository:
            ExecutionRepository,

        private readonly identifierGenerator:
            IdentifierGenerator,

        private readonly clock:
            Clock,

        private readonly events?:
            EventPublisher,

        private readonly logger?:
            Logger,

    ) {}

    async start(
        request: StartExecutionRequest,
    ): Promise<Execution> {

        const startedAt =
            this.clock.now();

        const executionId =
            await this.identifierGenerator.generate();

        this.logger?.debug(
            "Execution started.",
            {
                executionId,

                pipeline:
                    request.pipeline,
            },
        );

        let execution: Execution = {

            id:
                executionId,

            pipeline:
                request.pipeline,

            state:
                "PENDING",

            artifacts:
                request.artifacts,

            metadata: {

                startedAt,

            },

        };

        this.events?.publish({

            type:
                "EXECUTION_STARTED",

            timestamp:
                startedAt,

            component:
                "ExecutionRuntime",

            executionId:
                execution.id,

            data: {

                pipeline:
                    execution.pipeline,

            },

        });

        try {

            await this.repository.create(
                execution,
            );

            execution = {

                ...execution,

                state:
                    "RUNNING",

            };

            await this.repository.update(
                execution,
            );

            const result =
                await this.pipelineRuntime.execute(

                    request.pipeline,

                    {
                        executionId:
                            execution.id,
                    },

                    {
                        artifacts:
                            execution.artifacts,
                    },

                );

            const completedAt =
                this.clock.now();

            execution = {

                ...execution,

                state:
                    "COMPLETED",

                artifacts:
                    result.artifacts,

                metadata: {

                    startedAt,

                    completedAt,

                    durationMs:
                        completedAt.getTime() -
                        startedAt.getTime(),

                },

            };

            await this.repository.update(
                execution,
            );

            this.events?.publish({

                type:
                    "EXECUTION_COMPLETED",

                timestamp:
                    completedAt,

                component:
                    "ExecutionRuntime",

                executionId:
                    execution.id,

                data: {

                    pipeline:
                        execution.pipeline,

                },

            });

            this.logger?.debug(
                "Execution completed.",
                {
                    executionId:
                        execution.id,

                    pipeline:
                        execution.pipeline,

                    durationMs:
                        execution.metadata.durationMs,

                    artifactCount:
                        execution.artifacts.length,
                },
            );

            return execution;

        }
        catch (error) {

            const platformError =
                error instanceof PlatformError
                    ? error
                    : new PlatformError(
                        "EXECUTION_FAILED",
                        `Execution '${execution.id}' failed.`,
                        {
                            component:
                                "ExecutionRuntime",

                            details: {
                                executionId:
                                    execution.id,

                                pipeline:
                                    execution.pipeline,
                            },

                            cause:
                                error,
                        },
                    );

            const completedAt =
                this.clock.now();

            execution = {

                ...execution,

                state:
                    "FAILED",

                metadata: {

                    startedAt,

                    completedAt,

                    durationMs:
                        completedAt.getTime() -
                        startedAt.getTime(),

                },

            };

            await this.repository.update(
                execution,
            );

            this.events?.publish({

                type:
                    "EXECUTION_FAILED",

                timestamp:
                    completedAt,

                component:
                    "ExecutionRuntime",

                executionId:
                    execution.id,

                data: {

                    pipeline:
                        execution.pipeline,

                    code:
                        platformError.code,

                },

            });

            this.logger?.error(
                "Execution failed.",
                {
                    executionId:
                        execution.id,

                    pipeline:
                        execution.pipeline,

                    code:
                        platformError.code,

                    error:
                        platformError.message,

                    durationMs:
                        execution.metadata.durationMs,
                },
            );

            throw platformError;

        }

    }

}

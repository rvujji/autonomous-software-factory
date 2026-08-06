import {
    Execution,
    StartExecutionRequest,
} from "@engineering/shared/execution";

import { Clock } from "../foundation/Clock.js";
import { IdentifierGenerator } from "@engineering/shared/foundation";

import { PipelineRuntime } from "../pipeline/PipelineRuntime.js";
import { ExecutionRepository } from "./ExecutionRepository.js";

export class ExecutionRuntime {

    constructor(

        private readonly pipelineRuntime: PipelineRuntime,

        private readonly repository: ExecutionRepository,

        private readonly identifierGenerator: IdentifierGenerator,

        private readonly clock: Clock,

    ) {}

    async start(
        request: StartExecutionRequest,
    ): Promise<Execution> {

        const startedAt =
            this.clock.now();

        let execution: Execution = {

            id: await this.identifierGenerator.generate(),

            pipeline: request.pipeline,

            state: "PENDING",

            artifacts: request.artifacts,

            metadata: {

                startedAt,

            },

        };

        await this.repository.create(
            execution,
        );

        execution = {

            ...execution,

            state: "RUNNING",

        };

        await this.repository.update(
            execution,
        );

        try {

            const result =
                await this.pipelineRuntime.execute(

                    request.pipeline,

                    {},

                    {

                        artifacts: execution.artifacts,

                    },

                );

            const completedAt =
                this.clock.now();

            execution = {

                ...execution,

                state: "COMPLETED",

                artifacts: result.artifacts,

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

            return execution;

        }
        catch (error) {

            const completedAt =
                this.clock.now();

            execution = {

                ...execution,

                state: "FAILED",

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

            throw error;

        }

    }

}
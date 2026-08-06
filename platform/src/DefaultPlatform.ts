import { ArtifactRuntime } from "@engineering/core/artifact";
import { EngineRuntime } from "@engineering/core/engine";
import { ExecutionRuntime } from "@engineering/core/execution";
import { PipelineRuntime } from "@engineering/core/pipeline";
import { Platform } from "./Platform.js";
import { SystemClock } from "@engineering/core/foundation";
import { UuidIdentifierGenerator } from "@engineering/core/foundation";
import { InMemoryArtifactStore } from "@engineering/core/artifact";
import { InMemoryExecutionRepository } from "@engineering/core/execution";
import { InMemoryEngineRegistry } from "@engineering/core/engine";
import { InMemoryPipelineRegistry } from "@engineering/core/pipeline";
import { EngineeringEnginePack } from "@engineering/engine-pack";
import { EnginePack } from "@engineering/shared/platform";

export class DefaultPlatform
implements Platform {

    readonly artifacts: ArtifactRuntime;

    readonly engines: EngineRuntime;

    readonly pipelines: PipelineRuntime;

    readonly executions: ExecutionRuntime;

    private constructor(

        artifacts: ArtifactRuntime,

        engines: EngineRuntime,

        pipelines: PipelineRuntime,

        executions: ExecutionRuntime,

    ) {

        this.artifacts = artifacts;

        this.engines = engines;

        this.pipelines = pipelines;

        this.executions = executions;

    }

    static async create(

        enginePacks: readonly EnginePack[] = [

            new EngineeringEnginePack(),

        ],

    ): Promise<Platform>{

        //
        // Foundation
        //

        const clock =
            new SystemClock();

        const identifierGenerator =
            new UuidIdentifierGenerator();

        //
        // Persistence
        //

        const artifactStore =
            new InMemoryArtifactStore();

        const executionRepository =
            new InMemoryExecutionRepository();

        //
        // Registries
        //

        const engineRegistry =
            new InMemoryEngineRegistry();

        const pipelineRegistry =
            new InMemoryPipelineRegistry();

        //
        // Register Engines
        //

        for (const pack of enginePacks) {

            for (const engine of pack.engines) {

                await engineRegistry.register(
                    engine,
                );

            }

        }

        //
        // Register Pipelines
        //

        for (const pack of enginePacks) {

            for (const pipeline of pack.pipelines) {

                await pipelineRegistry.register(
                    pipeline,
                );

            }

        }

        const artifactRuntime =
            new ArtifactRuntime(
                artifactStore,
                identifierGenerator,
                clock,
            );

        const engineRuntime =
            new EngineRuntime(
                engineRegistry,
            );

        const pipelineRuntime =
            new PipelineRuntime(
                pipelineRegistry,
            );

        const executionRuntime =
            new ExecutionRuntime(

                pipelineRuntime,

                executionRepository,

                identifierGenerator,

                clock,

            );

        return new DefaultPlatform(

            artifactRuntime,

            engineRuntime,

            pipelineRuntime,

            executionRuntime,

        );

    }

}
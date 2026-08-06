import { ArtifactRuntime } from "../../core/src/runtime/artifact/ArtifactRuntime.js";
import { EngineRuntime } from "../../core/src/runtime/engine/EngineRuntime.js";
import { ExecutionRuntime } from "../../core/src/runtime/execution/ExecutionRuntime.js";
import { PipelineRuntime } from "../../core/src/runtime/pipeline/PipelineRuntime.js";
import { Platform } from "./index.js";
import { SystemClock } from "../../core/src/runtime/foundation/SystemClock.js";
import { UuidIdentifierGenerator } from "../../core/src/runtime/foundation/UuidIdentifierGenerator.js";
import { InMemoryArtifactStore } from "../../core/src/runtime/artifact/InMemoryArtifactStore.js";
import { InMemoryExecutionRepository } from "../../core/src/runtime/execution/InMemoryExecutionRepository.js";
import { InMemoryEngineRegistry } from "../../core/src/runtime/engine/InMemoryEngineRegistry.js";
import { InMemoryPipelineRegistry } from "../../core/src/runtime/pipeline/InMemoryPipelineRegistry.js";
import { EngineeringEnginePack } from "../../engine-packs/engineering/src/EngineeringEnginePack.js";
import { EnginePack } from "@engineering/shared/platform/index.js";

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
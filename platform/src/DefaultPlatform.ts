import {
    BackendRuntime,
    InMemoryBackendRegistry,
} from "@engineering/core/backend";

import {
    ArtifactRuntime,
    InMemoryArtifactStore,
} from "@engineering/core/artifact";

import {
    EngineRuntime,
    InMemoryEngineRegistry,
} from "@engineering/core/engine";

import {
    ExecutionRuntime,
    InMemoryExecutionRepository,
} from "@engineering/core/execution";

import {
    PipelineRuntime,
    InMemoryPipelineRegistry,
} from "@engineering/core/pipeline";

import {
    ConsoleLogger,
    InMemoryEventPublisher,
    SystemClock,
    UuidIdentifierGenerator,
} from "@engineering/core/foundation";

import {
    Backend,
} from "@engineering/backend-shared";

import {
    EngineeringEnginePack,
} from "@engineering/engine-pack";

import {
    OpenCodeBackend,
} from "@engineering/backend-opencode";

import {
    NodeCliProcess,
} from "@engineering/backend-cli";

import {
    EnginePack,
} from "@engineering/shared/platform";

import {
    Platform,
} from "./Platform.js";

export class DefaultPlatform
implements Platform {

    readonly artifacts:
        ArtifactRuntime;

    readonly backends:
        BackendRuntime;

    readonly engines:
        EngineRuntime;

    readonly pipelines:
        PipelineRuntime;

    readonly executions:
        ExecutionRuntime;
        

    private constructor(

        artifacts:
            ArtifactRuntime,

        backends:
            BackendRuntime,

        engines:
            EngineRuntime,

        pipelines:
            PipelineRuntime,

        executions:
            ExecutionRuntime,

    ) {

        this.artifacts =
            artifacts;

        this.backends =
            backends;

        this.engines =
            engines;

        this.pipelines =
            pipelines;

        this.executions =
            executions;

    }

    static async create(

        enginePacks?:
            readonly EnginePack[],

        backends:
            readonly Backend[] = [

                new OpenCodeBackend(

                    new NodeCliProcess(),

                    {

                        executable:
                            "opencode",

                        arguments:
                            [],

                        format:
                            "json",

                    },

                ),

            ],

    ): Promise<Platform> {

        //
        // Foundation
        //

        const clock =
            new SystemClock();

        const identifierGenerator =
            new UuidIdentifierGenerator();

        const eventPublisher =
            new InMemoryEventPublisher();
        
        const logger = new ConsoleLogger();

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

        const backendRegistry =
            new InMemoryBackendRegistry();

        //
        // Register Backends
        //

        for (
            const backend
            of backends
        ) {

            await backendRegistry.register(
                backend,
            );

        }

        //
        // Artifact Runtime
        //

        const artifactRuntime =
            new ArtifactRuntime(

                artifactStore,

                identifierGenerator,

                clock,
                logger,
            );

        //
        // Backend Runtime
        //

        const backendRuntime =
            new BackendRuntime(
                backendRegistry,
                logger,
            );

        //
        // Engine Runtime
        //

        const engineRuntime =
            new EngineRuntime(
                engineRegistry,
                logger,
            );

        //
        // Resolve Engine Packs
        //

        const resolvedEnginePacks =
            enginePacks ?? [

                new EngineeringEnginePack(

                    backendRuntime,

                    engineRuntime,

                    artifactRuntime,

                ),

            ];

        //
        // Register Engines
        //

        for (
            const pack
            of resolvedEnginePacks
        ) {

            for (
                const engine
                of pack.engines
            ) {

                await engineRegistry.register(
                    engine,
                );

            }

        }

        //
        // Register Pipelines
        //

        for (
            const pack
            of resolvedEnginePacks
        ) {

            for (
                const pipeline
                of pack.pipelines
            ) {

                await pipelineRegistry.register(
                    pipeline,
                );

            }

        }

        //
        // Pipeline Runtime
        //

        const pipelineRuntime =
            new PipelineRuntime(
                pipelineRegistry,
                eventPublisher,
                logger,
            );

        //
        // Execution Runtime
        //

        const executionRuntime =
            new ExecutionRuntime(
                pipelineRuntime,
                executionRepository,
                identifierGenerator,
                clock,
                eventPublisher,
                logger,
            );

        return new DefaultPlatform(

            artifactRuntime,

            backendRuntime,

            engineRuntime,

            pipelineRuntime,

            executionRuntime,

        );

    }

}
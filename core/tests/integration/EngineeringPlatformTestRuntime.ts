import {
    ArtifactRuntime,
    InMemoryArtifactStore,
} from "../../src/runtime/artifact/index.js";

import {
    BackendRuntime,
    InMemoryBackendRegistry,
} from "../../src/runtime/backend/index.js";

import {
    EngineRuntime,
    InMemoryEngineRegistry,
} from "../../src/runtime/engine/index.js";

import {
    PipelineRuntime,
    InMemoryPipelineRegistry,
} from "../../src/runtime/pipeline/index.js";

import {
    SystemClock,
    UuidIdentifierGenerator,
} from "../../src/runtime/foundation/index.js";

import {
    EngineeringEnginePack,
} from "../../../engine-packs/engineering/src/EngineeringEnginePack.js";

import {
    AutonomousProjectFactory,
} from "../../src/runtime/factory/AutonomousProjectFactory.js";
import {
    OpenCodeBackend,
} from "../../../backends/opencode/src/OpenCodeBackend.js";

import {
    NodeCliProcess,
} from "../../../backends/cli/src/NodeCliProcess.js";


export interface EngineeringPlatformTestRuntime {

    readonly artifacts:
        ArtifactRuntime;

    readonly backends:
        BackendRuntime;

    readonly engines:
        EngineRuntime;

    readonly pipelines:
        PipelineRuntime;

    readonly factory:
        AutonomousProjectFactory;

}


export async function createEngineeringPlatformTestRuntime():
    Promise<EngineeringPlatformTestRuntime> {

    const artifacts =
        new ArtifactRuntime(

            new InMemoryArtifactStore(),

            new UuidIdentifierGenerator(),

            new SystemClock(),

        );

    const backendRegistry =
        new InMemoryBackendRegistry();

    await backendRegistry.register(

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

    );

    const backends =
        new BackendRuntime(
            backendRegistry,
        );
    
    console.log("[TEST] registered backends:",await backends.list(),);

    const engineRegistry =
        new InMemoryEngineRegistry();

    const engines =
        new EngineRuntime(
            engineRegistry,
        );

    const pipelineRegistry =
        new InMemoryPipelineRegistry();

    const pipelines =
        new PipelineRuntime(
            pipelineRegistry,
        );

    const pack =
        new EngineeringEnginePack(

            backends,

            engines,

            artifacts,

        );

    for (
        const engine
        of pack.engines
    ) {

        await engineRegistry.register(
            engine,
        );

    }

    for (
        const pipeline
        of pack.pipelines
    ) {

        await pipelineRegistry.register(
            pipeline,
        );

    }

    const factory =
        new AutonomousProjectFactory(

            engines,

            artifacts,

            pipelines,

        );

    return {

        artifacts,

        backends,

        engines,

        pipelines,

        factory,

    };

}
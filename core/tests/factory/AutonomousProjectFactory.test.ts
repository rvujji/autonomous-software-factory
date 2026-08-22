import {
    describe,
    expect,
    it,
} from "vitest";

import {
    AutonomousProjectFactory,
} from "../../src/runtime/factory/AutonomousProjectFactory.js";

import {
    ArtifactRuntime,
    InMemoryArtifactStore,
} from "../../src/runtime/artifact/index.js";

import {
    EngineRuntime,
    InMemoryEngineRegistry,
} from "../../src/runtime/engine/index.js";

import {
    SystemClock,
    UuidIdentifierGenerator,
} from "../../src/runtime/foundation/index.js";

import {
    Engine,
} from "@engineering/shared/engine";

import {
    ArtifactState,
} from "@engineering/shared/artifact";
import {
    PipelineRuntime,
    InMemoryPipelineRegistry,
} from "../../src/runtime/pipeline/index.js";
import {
    Pipeline,
} from "@engineering/shared/pipeline";

function createPipelineRuntime(): PipelineRuntime {

    const registry =
        new InMemoryPipelineRegistry();

    return new PipelineRuntime(
        registry,
    );

}

function createRequirementsRefinementPipeline(): Pipeline {

    return {

        specification: {

            name:
                "engineering.requirements-refinement",

            displayName:
                "Requirements Engineering",

            version:
                "1.0.0",

            type:
                "ENGINEERING",

            metadata: {

                version:
                    "1.0.0",

            },

            steps: [],

        },

        async execute(
            context,
            request,
        ) {

            const intake =
                request.artifacts[0];

            return {

                artifacts: [

                    {

                        id:
                            "requirements-document",

                        name:
                            "Requirements Document",

                        type:
                            "REQUIREMENTS_DOCUMENT",

                        version:
                            1,

                        state:
                            ArtifactState.CREATED,

                        metadata: {

                            createdAt:
                                new Date(),

                        },

                        parents: intake
                            ? [

                                {

                                    id:
                                        intake.id,

                                    version:
                                        intake.version,

                                    type:
                                        intake.type,

                                    name:
                                        intake.name,

                                },

                            ]
                            : [],

                        payload:
                            "# Generated Requirements",

                    },

                ],

            };

        },

    };

}

function createArtifactRuntime(): ArtifactRuntime {

    return new ArtifactRuntime(

        new InMemoryArtifactStore(),

        new UuidIdentifierGenerator(),

        new SystemClock(),

    );

}


function createDiscoveryEngine(): Engine {

    return {

        specification: {

            name:
                "engineering.discover-work",

            displayName:
                "Discover Work",

            type:
                "ANALYZER",

            metadata: {

                version:
                    "1.0.0",

            },

        },

        async execute(
            context,
            request,
        ) {

            const intake =
                request.input.artifacts[0];

            expect(
                intake,
            ).toBeDefined();

            expect(
                intake?.type,
            ).toMatch(
                /^(PROJECT_INTAKE|TOPIC_INTAKE)$/,
            );

            return {

                output: {

                    artifacts: [

                        {

                            id:
                                "work-plan",

                            name:
                                "Project Work Plan",

                            type:
                                "WORK_PLAN",

                            version:
                                1,

                            state:
                                ArtifactState.CREATED,

                            metadata: {

                                createdAt:
                                    new Date(),

                            },

                            parents: [

                                {

                                    id:
                                        intake!.id,

                                    version:
                                        intake!.version,

                                    type:
                                        intake!.type,

                                    name:
                                        intake!.name,

                                },

                            ],

                            payload: {

                                projectName:
                                    intake!.type ===
                                    "TOPIC_INTAKE"
                                        ? (
                                            intake!.payload as {
                                                topic: string;
                                            }
                                        ).topic
                                        : "Test Project",

                                projectObjective:
                                    "Determine and produce the required project artifacts.",

                                workItems: [

                                    {

                                        id:
                                            "requirements",

                                        name:
                                            "Requirements",

                                        kind:
                                            "REQUIREMENTS",

                                        objective:
                                            "Produce validated requirements.",

                                        required:
                                            true,

                                        dependsOn:
                                            [],

                                    },

                                ],

                            },

                        },

                    ],

                },

            };

        },

    };

}


describe(
    "AutonomousProjectFactory",
    () => {

        it(
            "converts project input into intake and discovers work",
            async () => {

                const registry =
                    new InMemoryEngineRegistry();

                await registry.register(
                    createDiscoveryEngine(),
                );

                const engines =
                    new EngineRuntime(
                        registry,
                    );

                const artifacts =
                    createArtifactRuntime();

                const pipelineRegistry =
                    new InMemoryPipelineRegistry();

                await pipelineRegistry.register(
                    createRequirementsRefinementPipeline(),
                );

                const pipelines =
                    new PipelineRuntime(
                        pipelineRegistry,
                    );

                const factory =
                    new AutonomousProjectFactory(

                        engines,

                        artifacts,
                        pipelines,

                    );

                const sourceArtifact = {

                    id:
                        "source-1",

                    name:
                        "Digital Coach Project",

                    type:
                        "PROJECT_DOCUMENT",

                    version:
                        1,

                    state:
                        ArtifactState.CREATED,

                    metadata: {

                        createdAt:
                            new Date(),

                    },

                    parents: [],

                    payload:
                        "Digital coach project requirements and research.",

                };

                const result =
                    await factory.execute(

                        {},

                        {

                            kind:
                                "PROJECT",

                            artifacts: [

                                sourceArtifact,

                            ],

                        },

                    );

                expect(
                    result.artifacts,
                ).toHaveLength(3);

                expect(
                    result.artifacts[0]?.type,
                ).toBe(
                    "PROJECT_INTAKE",
                );

                expect(
                    result.artifacts[1]?.type,
                ).toBe(
                    "WORK_PLAN",
                );

                expect(
                    result.artifacts[2]?.type,
                ).toBe(
                    "REQUIREMENTS_DOCUMENT",
                );

                expect(
                    result.artifacts[2]?.payload,
                ).toContain(
                    "# Generated Requirements",
                );

            },
        );


        it(
            "converts topic input into intake and discovers work",
            async () => {

                const registry =
                    new InMemoryEngineRegistry();

                await registry.register(
                    createDiscoveryEngine(),
                );

                const engines =
                    new EngineRuntime(
                        registry,
                    );

                const artifacts =
                    createArtifactRuntime();

                const pipelineRegistry =
                    new InMemoryPipelineRegistry();

                await pipelineRegistry.register(
                    createRequirementsRefinementPipeline(),
                );

                const pipelines =
                    new PipelineRuntime(
                        pipelineRegistry,
                    );

                const factory =
                    new AutonomousProjectFactory(

                        engines,

                        artifacts,
                        pipelines,

                    );

                const result =
                    await factory.execute(

                        {},

                        {

                            kind:
                                "TOPIC",

                            topic:
                                "Earth movers timing management",

                        },

                    );

                expect(
                    result.artifacts,
                ).toHaveLength(3);

                const intake =
                    result.artifacts[0];

                expect(
                    intake?.type,
                ).toBe(
                    "TOPIC_INTAKE",
                );

                expect(
                    (
                        intake?.payload as {
                            kind: string;
                            topic: string;
                        }
                    ).topic,
                ).toBe(
                    "Earth movers timing management",
                );

                const workPlan =
                    result.artifacts[1];

                expect(
                    workPlan?.type,
                ).toBe(
                    "WORK_PLAN",
                );

                expect(
                    workPlan?.parents[0]?.type,
                ).toBe(
                    "TOPIC_INTAKE",
                );

            },
        );


        it(
            "rejects an empty project input",
            async () => {

                const registry =
                    new InMemoryEngineRegistry();

                const engines =
                    new EngineRuntime(
                        registry,
                    );

                const artifacts =
                    createArtifactRuntime();

                const pipelineRegistry =
                    new InMemoryPipelineRegistry();

                await pipelineRegistry.register(
                    createRequirementsRefinementPipeline(),
                );

                const pipelines =
                    new PipelineRuntime(
                        pipelineRegistry,
                    );

                const factory =
                    new AutonomousProjectFactory(

                        engines,

                        artifacts,
                        pipelines,

                    );

                await expect(

                    factory.execute(

                        {},

                        {

                            kind:
                                "PROJECT",

                            artifacts: [],

                        },

                    ),

                ).rejects.toThrow(
                    "Project input requires at least one artifact.",
                );

            },
        );


        it(
            "rejects an empty topic",
            async () => {

                const registry =
                    new InMemoryEngineRegistry();

                const engines =
                    new EngineRuntime(
                        registry,
                    );

                const artifacts =
                    createArtifactRuntime();

                const pipelines =
                    createPipelineRuntime();

                const factory =
                    new AutonomousProjectFactory(

                        engines,

                        artifacts,
                        pipelines,

                    );

                await expect(

                    factory.execute(

                        {},

                        {

                            kind:
                                "TOPIC",

                            topic:
                                "   ",

                        },

                    ),

                ).rejects.toThrow(
                    "Topic input requires a non-empty topic.",
                );

            },
        );


    },
);
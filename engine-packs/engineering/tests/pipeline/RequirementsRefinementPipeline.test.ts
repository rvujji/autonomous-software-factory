import {
    describe,
    expect,
    it,
} from "vitest";

import {
    RequirementsRefinementPipeline,
} from "../../src/pipeline/RequirementsRefinementPipeline.js";

import {
    ArtifactRuntime,
} from "@engineering/core/artifact";

import {
    EngineRuntime,
    InMemoryEngineRegistry,
} from "@engineering/core/engine";

import {
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    Clock,
    IdentifierGenerator,
} from "@engineering/core/foundation";

type FailureStage =
    | "extract"
    | "synthesize"
    | "refine"
    | "validate";


interface TestPipeline {

    readonly pipeline:
        RequirementsRefinementPipeline;

    readonly storedArtifacts:
        readonly unknown[];

}


async function createPipeline(
    failureStage: FailureStage,
): Promise<TestPipeline> {

    let identifier =
        0;

    const identifiers:
        IdentifierGenerator = {

        async generate() {

            identifier++;

            return `artifact-${identifier}`;

        },

    };

    const clock:
        Clock = {

        now() {

            return new Date(
                "2026-01-01T00:00:00.000Z",
            );

        },

    };

    const storedArtifacts:
        unknown[] = [];

    const store = {

        async store(
            artifact: unknown,
        ) {

            storedArtifacts.push(
                artifact,
            );

        },

        async get() {

            return undefined;

        },

        async exists() {

            return false;

        },

    };

    const artifacts =
        new ArtifactRuntime(
            store,
            identifiers,
            clock,
        );

    const registry =
        new InMemoryEngineRegistry();

    const engines =
        new EngineRuntime(
            registry,
        );

    await registry.register({

        specification: {

            name:
                "engineering.extract-knowledge",

            displayName:
                "Extract Knowledge",

            type:
                "RESEARCH",

            metadata: {

                version:
                    "1.0.0",

            },

        },

        async execute() {

            if (
                failureStage ===
                "extract"
            ) {

                throw new Error(
                    "extract failed",
                );

            }

            return {

                output: {

                    artifacts: [

                        {

                            id:
                                "findings",

                            name:
                                "Knowledge Findings",

                            type:
                                "KNOWLEDGE_FINDINGS",

                            version:
                                1,

                            state:
                                ArtifactState.CREATED,

                            metadata: {

                                createdAt:
                                    new Date(),

                            },

                            parents: [],

                            payload: {

                                findings: [],

                            },

                        },

                    ],

                },

            };

        },

    });

    await registry.register({

        specification: {

            name:
                "engineering.synthesize-knowledge",

            displayName:
                "Synthesize Knowledge",

            type:
                "SYNTHESIZER",

            metadata: {

                version:
                    "1.0.0",

            },

        },

        async execute() {

            if (
                failureStage ===
                "synthesize"
            ) {

                throw new Error(
                    "synthesis failed",
                );

            }

            return {

                output: {

                    artifacts: [

                        {

                            id:
                                "synthesis",

                            name:
                                "Knowledge Synthesis",

                            type:
                                "KNOWLEDGE_SYNTHESIS",

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
                                        "findings",

                                    version:
                                        1,

                                    type:
                                        "KNOWLEDGE_FINDINGS",

                                    name:
                                        "Knowledge Findings",

                                },

                            ],

                            payload: {

                                id:
                                    "synthesis",

                                topic:
                                    "Engineering Platform",

                                summary:
                                    "Test synthesis",

                                findings: [],

                                conclusions: [],

                                uncertainties: [],

                                recommendations: [],

                            },

                        },

                    ],

                },

            };

        },

    });

    await registry.register({

        specification: {

            name:
                "engineering.refine-requirements",

            displayName:
                "Refine Requirements",

            type:
                "REFINER",

            metadata: {

                version:
                    "1.0.0",

            },

        },

        async execute() {

            if (
                failureStage ===
                "refine"
            ) {

                throw new Error(
                    "refinement failed",
                );

            }

            return {

                output: {

                    artifacts: [

                        {

                            id:
                                "requirement-set",

                            name:
                                "Requirement Set",

                            type:
                                "REQUIREMENT_SET",

                            version:
                                1,

                            state:
                                ArtifactState.CREATED,

                            metadata: {

                                createdAt:
                                    new Date(),

                            },

                            parents: [],

                            payload: {

                                projectName:
                                    "Engineering Platform",

                                version:
                                    "1.0.0",

                                functionalRequirements: [],

                                nonFunctionalRequirements: [],

                                candidates: [],

                                constraints: [],

                                assumptions: [],

                            },

                        },

                    ],

                },

            };

        },

    });

    await registry.register({

        specification: {

            name:
                "engineering.validate-requirement-set",

            displayName:
                "Validate Requirement Set",

            type:
                "VALIDATOR",

            metadata: {

                version:
                    "1.0.0",

            },

        },

        async execute() {

            if (
                failureStage ===
                "validate"
            ) {

                throw new Error(
                    "validation failed",
                );

            }

            return {

                output: {

                    artifacts: [

                        {

                            id:
                                "validated",

                            name:
                                "Validated Requirement Set",

                            type:
                                "VALIDATED_REQUIREMENT_SET",

                            version:
                                2,

                            state:
                                ArtifactState.CREATED,

                            metadata: {

                                createdAt:
                                    new Date(),

                            },

                            parents: [],

                            payload: {},

                        },

                    ],

                },

            };

        },

    });

    return {

        pipeline:
            new RequirementsRefinementPipeline(
                engines,
                artifacts,
            ),

        storedArtifacts,

    };

}


function createSourceArtifact() {

    return {

        id:
            "source",

        name:
            "Project Requirements",

        type:
            "REQUIREMENTS_SOURCE",

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
            "Test requirements",

    };

}


describe(
    "RequirementsRefinementPipeline failure handling",
    () => {

        it.each([
            "extract",
            "synthesize",
            "refine",
            "validate",
        ] as FailureStage[])(
            "stops execution when %s stage fails",
            async (
                failureStage,
            ) => {

                const {
                    pipeline,
                    storedArtifacts,
                } =
                    await createPipeline(
                        failureStage,
                    );

                await expect(

                    pipeline.execute(

                        {},

                        {

                            artifacts: [

                                createSourceArtifact(),

                            ],

                        },

                    ),

                ).rejects.toThrow(
                    failureStage === "extract"
                        ? "extract failed"
                        : failureStage === "synthesize"
                            ? "synthesis failed"
                            : failureStage === "refine"
                                ? "refinement failed"
                                : "validation failed",
                );

                const expectedPersistedCount =
                    {

                        extract:
                            0,

                        synthesize:
                            1,

                        refine:
                            2,

                        validate:
                            3,

                    }[failureStage];

                expect(
                    storedArtifacts,
                ).toHaveLength(
                    expectedPersistedCount,
                );

            },
        );

    },
);

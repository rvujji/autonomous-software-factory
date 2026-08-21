import {
    describe,
    expect,
    it,
} from "vitest";

import {
    ValidateRequirementSetEngine,
} from "../src/requirements/ValidateRequirementSetEngine.js";

import {
    ArtifactState,
} from "@engineering/shared/artifact";

function createArtifact(
    payload: unknown,
) {

    return {

        id:
            "requirement-set-1",

        name:
            "Requirement Set",

        type:
            "REQUIREMENT_SET",

        version:
            1,

        state:
            "CREATED" as ArtifactState,

        metadata: {

            createdAt:
                new Date(),

        },

        parents: [],

        payload,

    };

}

function createRequirement(
    overrides:
        Record<string, unknown> = {},
) {

    return {

        id:
            "FR-001",

        title:
            "Create project",

        description:
            "The platform must allow users to create projects.",

        type:
            "FUNCTIONAL",

        priority:
            "HIGH",

        status:
            "DRAFT",

        acceptanceCriteria: [

            {

                id:
                    "AC-FR-001-1",

                description:
                    "A user can create a project.",

            },

        ],

        provenance: {

            sourceType:
                "RESEARCH",

            sourceArtifactIds: [

                "knowledge-synthesis-1",

            ],

            rationale:
                "Supported by finding KF-001.",

        },

        ...overrides,

    };

}

function createValidPayload() {

    return {

        projectName:
            "Engineering Platform",

        version:
            "1.0.0",

        functionalRequirements: [

            createRequirement(),

        ],

        nonFunctionalRequirements: [

            {

                id:
                    "NFR-001",

                title:
                    "Secure authentication",

                description:
                    "Authenticated operations must be protected.",

                type:
                    "NON_FUNCTIONAL",

                priority:
                    "CRITICAL",

                status:
                    "DRAFT",

                acceptanceCriteria: [

                    {

                        id:
                            "AC-NFR-001-1",

                        description:
                            "Unauthenticated access is rejected.",

                    },

                ],

                provenance: {

                    sourceType:
                        "RESEARCH",

                    sourceArtifactIds: [

                        "knowledge-synthesis-1",

                    ],

                    rationale:
                        "Supported by security findings.",

                },

            },

        ],

        candidates: [

            {

                id:
                    "CAND-001",

                title:
                    "Advanced analytics",

                description:
                    "The platform may provide advanced analytics.",

                type:
                    "FUNCTIONAL",

                priority:
                    "MEDIUM",

                rationale:
                    "Potentially useful but insufficient evidence exists to make this an actual requirement.",

                provenance: {

                    sourceType:
                        "RESEARCH",

                    sourceArtifactIds: [

                        "knowledge-synthesis-1",

                    ],

                    rationale:
                        "Derived from an unresolved research finding.",

                },

                confidence:
                    "LOW",

            },

        ],

        constraints: [

            {

                id:
                    "C-001",

                description:
                    "The system must preserve artifact traceability.",

            },

        ],

        assumptions: [

            {

                id:
                    "A-001",

                description:
                    "Users have authenticated accounts.",

            },

        ],

    };

}

describe(
    "ValidateRequirementSetEngine",
    () => {

        it(
            "validates a complete requirement set",
            async () => {

                const engine =
                    new ValidateRequirementSetEngine();

                const result =
                    await engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        createValidPayload(),
                                    ),

                                ],

                            },

                        },

                    );

                expect(
                    result.output.artifacts,
                ).toHaveLength(1);

                const artifact = result.output.artifacts[0] as any;

                expect(
                    artifact?.type,
                ).toBe(
                    "VALIDATED_REQUIREMENT_SET",
                );

                const payload =
                    artifact?.payload as any;

                expect(
                    payload.functionalRequirements,
                ).toHaveLength(1);

                expect(
                    payload.nonFunctionalRequirements,
                ).toHaveLength(1);

                expect(
                    payload.candidates,
                ).toHaveLength(1);

            },
        );

        it(
            "rejects the old requirements property",
            async () => {

                const payload =
                    createValidPayload() as any;

                payload.requirements = [

                    ...payload.functionalRequirements,

                ];

                delete payload.functionalRequirements;
                delete payload.nonFunctionalRequirements;

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "functionalRequirements must be an array",
                );

            },
        );

        it(
            "rejects a functional requirement with NON_FUNCTIONAL type",
            async () => {

                const payload =
                    createValidPayload();

                (
                    payload.functionalRequirements[0] as any
                ).type =
                    "NON_FUNCTIONAL";

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "functionalRequirements[0].type must be FUNCTIONAL",
                );

            },
        );

        it(
            "rejects a non-functional requirement with FUNCTIONAL type",
            async () => {

                const payload =
                    createValidPayload();

                (
                    payload.nonFunctionalRequirements[0] as any
                ).type =
                    "FUNCTIONAL";

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "nonFunctionalRequirements[0].type must be NON_FUNCTIONAL",
                );

            },
        );

        it(
            "rejects duplicate requirement IDs across functional and non-functional requirements",
            async () => {

                const payload =
                    createValidPayload();

                (
                    payload.nonFunctionalRequirements[0] as any
                ).id =
                    "FR-001";

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "Duplicate requirements id 'FR-001'",
                );

            },
        );

        it(
            "rejects a candidate ID that conflicts with a requirement",
            async () => {

                const payload =
                    createValidPayload();

                (
                    payload.candidates[0] as any
                ).id =
                    "FR-001";

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "conflicts with a requirement id",
                );

            },
        );

        it(
            "requires provenance on actual requirements",
            async () => {

                const payload =
                    createValidPayload();

                delete (
                    payload.functionalRequirements[0] as any
                ).provenance;

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "functionalRequirements[0].provenance is required",
                );

            },
        );

        it(
            "requires at least one provenance source artifact",
            async () => {

                const payload =
                    createValidPayload();

                (
                    payload.functionalRequirements[0] as any
                ).provenance.sourceArtifactIds =
                    [];

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "sourceArtifactIds must contain at least one artifact ID",
                );

            },
        );

        it(
            "rejects duplicate acceptance criterion IDs",
            async () => {

                const payload =
                    createValidPayload();

                (
                    payload.functionalRequirements[0] as any
                ).acceptanceCriteria.push({

                    id:
                        "AC-FR-001-1",

                    description:
                        "Duplicate criterion.",

                });

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "Duplicate acceptance criterion id",
                );

            },
        );

        it(
            "rejects invalid requirement priority",
            async () => {

                const payload =
                    createValidPayload();

                (
                    payload.functionalRequirements[0] as any
                ).priority =
                    "URGENT";

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "priority must be one of",
                );

            },
        );

        it(
            "rejects missing candidate provenance",
            async () => {

                const payload =
                    createValidPayload();

                delete (
                    payload.candidates[0] as any
                ).provenance;

                const engine =
                    new ValidateRequirementSetEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    createArtifact(
                                        payload,
                                    ),

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "candidates[0].provenance is required",
                );

            },
        );

    },
);
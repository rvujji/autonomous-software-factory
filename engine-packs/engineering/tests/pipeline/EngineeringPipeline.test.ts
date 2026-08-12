import {
    describe,
    expect,
    it,
} from "vitest";

import {
    ArtifactRuntime,
    InMemoryArtifactStore,
} from "@engineering/core/artifact";

import {
    EngineRuntime,
    InMemoryEngineRegistry,
} from "@engineering/core/engine";

import {
    SystemClock,
    UuidIdentifierGenerator,
} from "@engineering/core/foundation";

import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
} from "@engineering/shared/engine";

import {
    EngineeringPipeline,
} from "../../src/pipeline/EngineeringPipeline.js";
import { ArtifactState } from "../../../../shared/dist/artifact/artifact-state.js";


function createArtifactRuntime(): ArtifactRuntime {

    return new ArtifactRuntime(

        new InMemoryArtifactStore(),

        new UuidIdentifierGenerator(),

        new SystemClock(),

    );

}


describe(
    "EngineeringPipeline",
    () => {

        it(
            "repairs requirements after review failure and validates them successfully",
            async () => {

                const registry =
                    new InMemoryEngineRegistry();

                const engines =
                    new EngineRuntime(
                        registry,
                    );

                const artifacts =
                    createArtifactRuntime();

                let validationAttempts = 0;

                const parseEngine: Engine = {

                    specification: {

                        name:
                            "engineering.parse-requirements",

                        displayName:
                            "Test Parse",

                        type:
                            "PARSER" as Engine["specification"]["type"],

                        metadata: {

                            version:
                                "1.0.0",

                        },

                    },

                    async execute(
                        context: EngineContext,
                        request: EngineRequest,
                    ): Promise<EngineResult> {

                        return {

                            output: {

                                artifacts: [

                                    {

                                        id:
                                            "parsed",

                                        name:
                                            "Parsed Requirements",

                                        type:
                                            "REQUIREMENTS",

                                        version:
                                            1,

                                        state:
                                            "CREATED" as ArtifactState,

                                        metadata: {

                                            createdAt:
                                                new Date(),

                                        },

                                        parents:
                                            request.input.artifacts,

                                        payload: {

                                            projectName:
                                                "Test Project",

                                            version:
                                                "1.0.0",

                                            functionalRequirements: [

                                                {

                                                    id:
                                                        "FR-1",

                                                    title:
                                                        "Create project",

                                                    description:
                                                        "Create an engineering project.",

                                                    type:
                                                        "FUNCTIONAL",

                                                    priority:
                                                        "HIGH",

                                                    status:
                                                        "DRAFT",

                                                    acceptanceCriteria: [],

                                                },

                                            ],

                                            nonFunctionalRequirements: [],

                                            constraints: [],

                                            assumptions: [],

                                        },

                                    },

                                ],

                            },

                        };

                    },

                };

                const validateEngine: Engine = {

                    specification: {

                        name:
                            "engineering.validate-requirements",

                        displayName:
                            "Test Validate",

                        type:
                            "VALIDATOR",

                        metadata: {

                            version:
                                "1.0.0",

                        },

                    },

                    async execute(
                        context: EngineContext,
                        request: EngineRequest,
                    ): Promise<EngineResult> {

                        validationAttempts++;

                        const artifact =
                            request.input.artifacts[0];

                        if (
                            validationAttempts === 1
                        ) {

                            throw new Error(
                                "functionalRequirements[0] must contain acceptance criteria.",
                            );

                        }

                        return {

                            output: {

                                artifacts: [

                                    {

                                        id:
                                            "validated",

                                        name:
                                            "Validated Requirements",

                                        type:
                                            "VALIDATED_REQUIREMENTS",

                                        version:
                                            1,

                                        state:
                                            "CREATED" as ArtifactState,

                                        metadata: {

                                            createdAt:
                                                new Date(),

                                        },

                                        parents: artifact
                                            ? [

                                                {

                                                    id:
                                                        artifact.id,

                                                    version:
                                                        artifact.version,

                                                    type:
                                                        artifact.type,

                                                    name:
                                                        artifact.name,

                                                },

                                            ]
                                            : [],

                                        payload:
                                            artifact?.payload,

                                    },

                                ],

                            },

                        };

                    },

                };

                const repairEngine: Engine = {

                    specification: {

                        name:
                            "engineering.repair-requirements",

                        displayName:
                            "Test Repair",

                        type:
                            "REPAIR" as Engine["specification"]["type"],

                        metadata: {

                            version:
                                "1.0.0",

                        },

                    },

                    async execute(
                        context: EngineContext,
                        request: EngineRequest,
                    ): Promise<EngineResult> {

                        const artifact =
                            request.input.artifacts[0];

                        expect(
                            request.configuration?.validationError,
                        ).toBe(
                            "functionalRequirements[0] must contain acceptance criteria.",
                        );

                        expect(
                            artifact,
                        ).toBeDefined();

                        return {

                            output: {

                                artifacts: [

                                    {

                                        id:
                                            "repaired",

                                        name:
                                            "Repaired Requirements",

                                        type:
                                            "REQUIREMENTS",

                                        version:
                                            2,

                                        state:
                                            "CREATED" as ArtifactState,

                                        metadata: {

                                            createdAt:
                                                new Date(),

                                        },

                                        parents:
                                            artifact
                                                ? [

                                                    {

                                                        id:
                                                            artifact.id,

                                                        version:
                                                            artifact.version,

                                                        type:
                                                            artifact.type,

                                                        name:
                                                            artifact.name,

                                                    },

                                                ]
                                                : [],

                                        payload: {

                                            projectName:
                                                "Test Project",

                                            version:
                                                "1.0.0",

                                            functionalRequirements: [

                                                {

                                                    id:
                                                        "FR-1",

                                                    title:
                                                        "Create project",

                                                    description:
                                                        "Create an engineering project.",

                                                    type:
                                                        "FUNCTIONAL",

                                                    priority:
                                                        "HIGH",

                                                    status:
                                                        "DRAFT",

                                                    acceptanceCriteria: [

                                                        {

                                                            id:
                                                                "AC-1",

                                                            description:
                                                                "Project can be created.",

                                                        },

                                                    ],

                                                },

                                            ],

                                            nonFunctionalRequirements: [],

                                            constraints: [],

                                            assumptions: [],

                                        },

                                    },

                                ],

                            },

                        };

                    },

                };

                const planEngine: Engine = {

                    specification: {

                        name:
                            "engineering.plan-requirements",

                        displayName:
                            "Test Plan",

                        type:
                            "PLANNER" as Engine["specification"]["type"],

                        metadata: {

                            version:
                                "1.0.0",

                        },

                    },

                    async execute(
                        context: EngineContext,
                        request: EngineRequest,
                    ): Promise<EngineResult> {

                        const artifact =
                            request.input.artifacts[0];

                        expect(
                            artifact,
                        ).toBeDefined();

                        return {

                            output: {

                                artifacts: [

                                    {

                                        id:
                                            "plan",

                                        name:
                                            "Requirements Plan",

                                        type:
                                            "REQUIREMENTS_PLAN",

                                        version:
                                            1,

                                        state:
                                            "CREATED" as ArtifactState,

                                        metadata: {

                                            createdAt:
                                                new Date(),

                                        },

                                        parents:
                                            artifact
                                                ? [

                                                    {

                                                        id:
                                                            artifact.id,

                                                        version:
                                                            artifact.version,

                                                        type:
                                                            artifact.type,

                                                        name:
                                                            artifact.name,

                                                    },

                                                ]
                                                : [],

                                        payload: {

                                            name:
                                                "requirements-engineering",

                                            version:
                                                "1.0.0",

                                            objective:
                                                "Test requirements planning.",

                                            inputs: [],

                                            steps: [

                                                {

                                                    id:
                                                        "requirements-analysis",

                                                    name:
                                                        "Analyze Requirements",

                                                    objective:
                                                        "Analyze requirements.",

                                                },

                                                {

                                                    id:
                                                        "requirements-design",

                                                    name:
                                                        "Design Solution Structure",

                                                    objective:
                                                        "Design the solution.",

                                                },

                                                {

                                                    id:
                                                        "requirements-verification",

                                                    name:
                                                        "Define Verification",

                                                    objective:
                                                        "Define verification.",

                                                },

                                            ],

                                            dependencies: [],

                                            expectedArtifacts: [],

                                            constraints: [],

                                        },

                                    },

                                ],

                            },

                        };

                    },

                };

                await registry.register(
                    parseEngine,
                );

                await registry.register(
                    validateEngine,
                );

                await registry.register(
                    repairEngine,
                );

                await registry.register(
                    planEngine,
                );

                const pipeline =
                    new EngineeringPipeline(

                        engines,

                        artifacts,

                    );

                const result =
                    await pipeline.execute(

                        {},

                        {

                            artifacts: [

                                {

                                    id:
                                        "source",

                                    name:
                                        "Requirements",

                                    type:
                                        "REQUIREMENTS_SOURCE",

                                    version:
                                        1,

                                    state:
                                        "CREATED" as ArtifactState,

                                    metadata: {

                                        createdAt:
                                            new Date(),

                                    },

                                    parents: [],

                                    payload:
                                        "# Test Requirements",

                                },

                            ],

                        },

                    );

                expect(
                    validationAttempts,
                ).toBe(2);

                expect(
                    result.artifacts,
                ).toHaveLength(1);

                expect(
                    result.artifacts[0]?.type,
                ).toBe(
                    "REQUIREMENTS_PLAN",
                );

            },
        );

    },
);
import {
    describe,
    expect,
    it,
} from "vitest";

import {
    BuildRequirementsGraphEngine,
} from "../src/requirements/BuildRequirementsGraphEngine.js";

import {
    ArtifactState,
} from "@engineering/shared/artifact";

describe(
    "BuildRequirementsGraphEngine",
    () => {

        it(
            "builds an execution graph from a requirements plan",
            async () => {

                const engine =
                    new BuildRequirementsGraphEngine();

                const result =
                    await engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    {

                                        id:
                                            "requirements-plan-1",

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

                                        parents: [],

                                        payload: {

                                            name:
                                                "requirements-engineering",

                                            version:
                                                "1.0.0",

                                            objective:
                                                "Produce an implementation-ready plan.",

                                            inputs: [],

                                            steps: [

                                                {

                                                    id:
                                                        "requirements-analysis",

                                                    name:
                                                        "Analyze Requirements",

                                                    objective:
                                                        "Analyze the requirements.",

                                                },

                                                {

                                                    id:
                                                        "requirements-design",

                                                    name:
                                                        "Design Solution Structure",

                                                    objective:
                                                        "Design the solution structure.",

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

                                            dependencies: [

                                                {

                                                    step:
                                                        "requirements-design",

                                                    dependsOn:
                                                        "requirements-analysis",

                                                },

                                                {

                                                    step:
                                                        "requirements-verification",

                                                    dependsOn:
                                                        "requirements-design",

                                                },

                                            ],

                                            expectedArtifacts: [],

                                            constraints: [],

                                        },

                                    },

                                ],

                            },

                        },

                    );

                expect(
                    result.output.artifacts,
                ).toHaveLength(1);

                const artifact =
                    result.output.artifacts?.[0];

                expect(
                    artifact,
                ).toBeDefined();

                expect(
                    artifact?.type,
                ).toBe(
                    "EXECUTION_GRAPH",
                );

                const graph =
                    artifact?.payload as {

                        readonly name:
                            string;

                        readonly version:
                            string;

                        readonly nodes:
                            readonly {

                                readonly id:
                                    string;

                                readonly name:
                                    string;

                                readonly objective:
                                    string;

                            }[];

                        readonly edges:
                            readonly {

                                readonly from:
                                    string;

                                readonly to:
                                    string;

                            }[];

                    };

                expect(
                    graph.name,
                ).toBe(
                    "requirements-engineering",
                );

                expect(
                    graph.version,
                ).toBe(
                    "1.0.0",
                );

                expect(
                    graph.nodes,
                ).toHaveLength(3);

                expect(
                    graph.nodes[0]?.id,
                ).toBe(
                    "requirements-analysis",
                );

                expect(
                    graph.nodes[1]?.id,
                ).toBe(
                    "requirements-design",
                );

                expect(
                    graph.nodes[2]?.id,
                ).toBe(
                    "requirements-verification",
                );

                expect(
                    graph.edges,
                ).toHaveLength(2);

                expect(
                    graph.edges[0],
                ).toEqual({

                    from:
                        "requirements-analysis",

                    to:
                        "requirements-design",

                });

                expect(
                    graph.edges[1],
                ).toEqual({

                    from:
                        "requirements-design",

                    to:
                        "requirements-verification",

                });

                expect(
                    artifact?.parents,
                ).toHaveLength(1);

                expect(
                    artifact?.parents[0]?.id,
                ).toBe(
                    "requirements-plan-1",
                );

            },
        );


        it(
            "rejects an artifact that is not a requirements plan",
            async () => {

                const engine =
                    new BuildRequirementsGraphEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    {

                                        id:
                                            "requirements-1",

                                        name:
                                            "Requirements",

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

                                        parents: [],

                                        payload: {},

                                    },

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "Expected REQUIREMENTS_PLAN artifact",
                );

            },
        );


        it(
            "rejects a dependency that references an unknown step",
            async () => {

                const engine =
                    new BuildRequirementsGraphEngine();

                await expect(

                    engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    {

                                        id:
                                            "requirements-plan-1",

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

                                        parents: [],

                                        payload: {

                                            name:
                                                "requirements-engineering",

                                            version:
                                                "1.0.0",

                                            objective:
                                                "Test invalid dependency.",

                                            inputs: [],

                                            steps: [

                                                {

                                                    id:
                                                        "step-a",

                                                    name:
                                                        "Step A",

                                                    objective:
                                                        "Test step.",

                                                },

                                            ],

                                            dependencies: [

                                                {

                                                    step:
                                                        "step-a",

                                                    dependsOn:
                                                        "missing-step",

                                                },

                                            ],

                                            expectedArtifacts: [],

                                            constraints: [],

                                        },

                                    },

                                ],

                            },

                        },

                    ),

                ).rejects.toThrow(
                    "Dependency references unknown step 'missing-step'",
                );

            },
        );

    },
);
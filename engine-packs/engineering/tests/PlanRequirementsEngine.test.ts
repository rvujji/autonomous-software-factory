import {
    describe,
    expect,
    it,
} from "vitest";

import {
    PlanRequirementsEngine,
} from "../src/requirements/PlanRequirementsEngine.js";
import { ArtifactState } from "../../../shared/dist/artifact/artifact-state.js";

describe(
    "PlanRequirementsEngine",
    () => {

        it(
            "creates a requirements plan from validated requirements",
            async () => {

                const engine =
                    new PlanRequirementsEngine();

                const result =
                    await engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    {

                                        id:
                                            "validated-1",

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

                                        parents: [],

                                        payload: {

                                            projectName:
                                                "Engineering Platform",

                                            version:
                                                "1.0.0",

                                            functionalRequirements: [],

                                            nonFunctionalRequirements: [],

                                            constraints: [

                                                {

                                                    id:
                                                        "C1",

                                                    description:
                                                        "The system must preserve traceability.",

                                                },

                                            ],

                                            assumptions: [],

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
                    result.output.artifacts[0];

                expect(
                    artifact?.type,
                ).toBe(
                    "REQUIREMENTS_PLAN",
                );

                const plan =
                    artifact?.payload as any;

                expect(
                    plan.name,
                ).toBe(
                    "requirements-engineering",
                );

                expect(
                    plan.steps,
                ).toHaveLength(3);

                expect(
                    plan.dependencies,
                ).toHaveLength(2);

                expect(
                    plan.constraints,
                ).toContain(
                    "The system must preserve traceability.",
                );

                expect(
                    artifact?.parents[0],
                ).toMatchObject({

                    id:
                        "validated-1",

                    version:
                        1,

                    type:
                        "VALIDATED_REQUIREMENTS",

                });

            },
        );

        it(
            "rejects non-validated requirements input",
            async () => {

                const engine =
                    new PlanRequirementsEngine();

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
                                            "REQUIREMENTS",

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
                    "Expected VALIDATED_REQUIREMENTS artifact",
                );

            },
        );

    },
);
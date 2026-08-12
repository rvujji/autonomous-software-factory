import {
    describe,
    expect,
    it,
} from "vitest";

import {
    GenerateRequirementsDocumentEngine,
} from "../src/requirements/GenerateRequirementsDocumentEngine.js";

import {
    ArtifactState,
} from "@engineering/shared/artifact";

describe(
    "GenerateRequirementsDocumentEngine",
    () => {

        it(
            "generates a readable requirements document",
            async () => {

                const engine =
                    new GenerateRequirementsDocumentEngine();

                const result =
                    await engine.execute(

                        {},

                        {

                            input: {

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
                                            ArtifactState.CREATED,

                                        metadata: {

                                            createdAt:
                                                new Date(),

                                        },

                                        parents: [],

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
                                                        "The system shall create projects.",

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
                                                                "A project can be created.",

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

                        },

                    );

                const artifact =
                    result.output.artifacts?.[0];

                expect(
                    artifact?.type,
                ).toBe(
                    "REQUIREMENTS_DOCUMENT",
                );

                expect(
                    artifact?.payload,
                ).toContain(
                    "# Test Project",
                );

                expect(
                    artifact?.payload,
                ).toContain(
                    "FR-1",
                );

                expect(
                    artifact?.payload,
                ).toContain(
                    "AC-1",
                );

            },

        );

    },
);
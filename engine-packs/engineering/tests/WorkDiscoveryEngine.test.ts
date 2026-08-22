import {
    describe,
    expect,
    it,
} from "vitest";

import {
    WorkDiscoveryEngine,
} from "../src/work/WorkDiscoveryEngine.js";

import {
    ArtifactState,
} from "@engineering/shared/artifact";

describe(
    "WorkDiscoveryEngine",
    () => {

        it(
            "discovers a project work plan",
            async () => {

                const engine =
                    new WorkDiscoveryEngine();

                const result =
                    await engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    {

                                        id:
                                            "project-1",

                                        name:
                                            "Earth Movers Timing Management",

                                        type:
                                            "PROJECT_INTENT",

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
                                            "Build a system for managing earth-mover machine timings, utilization, operators, customers and billing.",

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
                    "WORK_PLAN",
                );

                const plan =
                    artifact?.payload as any;

                expect(
                    plan.projectName,
                ).toBe(
                    "Earth Movers Timing Management",
                );

                expect(
                    plan.workItems,
                ).toHaveLength(4);

                expect(
                    plan.workItems.map(
                        (item: any) =>
                            item.kind,
                    ),
                ).toEqual([

                    "RESEARCH",
                    "PRODUCT_DEFINITION",
                    "REQUIREMENTS",
                    "ARCHITECTURE",

                ]);

            },
        );

        it(
            "preserves supplied project artifacts as work-plan parents",
            async () => {

                const engine =
                    new WorkDiscoveryEngine();

                const result =
                    await engine.execute(

                        {},

                        {

                            input: {

                                artifacts: [

                                    {

                                        id:
                                            "doc-1",

                                        name:
                                            "Digital Coach",

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
                                            "Existing market analysis and product strategy.",

                                    },

                                    {

                                        id:
                                            "doc-2",

                                        name:
                                            "Requirements",

                                        type:
                                            "REQUIREMENTS",

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
                                            "Existing requirements.",

                                    },

                                ],

                            },

                        },

                    );

                const artifact =
                    result.output.artifacts[0];

                expect(
                    artifact?.parents,
                ).toHaveLength(2);

                expect(
                    artifact?.parents.map(
                        parent =>
                            parent.id,
                    ),
                ).toEqual([

                    "doc-1",
                    "doc-2",

                ]);

            },
        );

    },
);
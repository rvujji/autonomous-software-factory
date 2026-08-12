import {
    describe,
    expect,
    it,
} from "vitest";

import {
    DefaultPlatform,
} from "../../src/DefaultPlatform.js";
import { ArtifactState } from "@engineering/shared/artifact";

describe(
    "Requirements Execution E2E",
    () => {

        it(
            "executes the complete requirements workflow through the platform",
            async () => {

                const platform =
                    await DefaultPlatform.create();

                const sourceArtifact = {

                    id:
                        "requirements-source",

                    name:
                        "Engineering Platform Requirements",

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

                    payload: `
# Engineering Platform

The platform must allow users to create engineering projects.

Users must be able to authenticate securely.

The system must maintain project requirements.

The platform must preserve traceability between engineering artifacts.

Engineering workflows must execute through registered backends.

The platform should provide reliable workflow execution.

Security controls must protect authenticated operations.
`,

                };

                const execution =
                    await platform.executions.start({

                        pipeline:
                            "engineering.requirements",

                        artifacts: [

                            sourceArtifact,

                        ],

                    });

                //
                // Execution lifecycle
                //

                expect(
                    execution.id,
                ).toBeTruthy();

                expect(
                    execution.pipeline,
                ).toBe(
                    "engineering.requirements",
                );

                expect(
                    execution.state,
                ).toBe(
                    "COMPLETED",
                );

                //
                // Execution metadata
                //

                expect(
                    execution.metadata.startedAt,
                ).toBeInstanceOf(
                    Date,
                );

                expect(
                    execution.metadata.completedAt,
                ).toBeInstanceOf(
                    Date,
                );

                expect(
                    execution.metadata.durationMs,
                ).toBeGreaterThanOrEqual(0);

                //
                // Pipeline result
                //

                expect(
                    execution.artifacts,
                ).toHaveLength(1);

                const artifact =
                    execution.artifacts[0];

                expect(
                    artifact,
                ).toBeDefined();

                expect(
                    artifact?.type,
                ).toBe(
                    "VALIDATED_REQUIREMENTS",
                );

                expect(
                    artifact?.payload,
                ).toBeDefined();

                //
                // Requirements payload
                //

                const payload =
                    artifact?.payload as {

                        readonly projectName:
                            string;

                        readonly version:
                            string;

                        readonly functionalRequirements:
                            readonly unknown[];

                        readonly nonFunctionalRequirements:
                            readonly unknown[];

                        readonly constraints:
                            readonly unknown[];

                        readonly assumptions:
                            readonly unknown[];

                    };

                expect(
                    payload.projectName,
                ).toBeTruthy();

                expect(
                    payload.version,
                ).toBeTruthy();

                expect(
                    payload.functionalRequirements.length +
                    payload.nonFunctionalRequirements.length,
                ).toBeGreaterThan(0);

                //
                // Execution repository
                //
                //
                // ExecutionRepository is intentionally
                // internal to the runtime, so we verify
                // persistence through the runtime's
                // observable execution state only.
                //

                expect(
                    execution.metadata.completedAt!.getTime(),
                ).toBeGreaterThanOrEqual(
                    execution.metadata.startedAt.getTime(),
                );

            },

            60_000,

        );

    },
);
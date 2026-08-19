import {
    describe,
    expect,
    it,
} from "vitest";

import {
    DefaultPlatform,
} from "../../src/DefaultPlatform.js";

import {
    ArtifactState,
} from "@engineering/shared/artifact";

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
                // Final pipeline result
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
                    "REQUIREMENTS_DOCUMENT",
                );

                expect(
                    artifact?.name,
                ).toBe(
                    "Requirements Document",
                );

                //
                // Generated document
                //

                expect(
                    artifact?.payload,
                ).toBeDefined();

                expect(
                    typeof artifact?.payload,
                ).toBe(
                    "string",
                );

                const document =
                    artifact?.payload as string;

                expect(
                    document.length,
                ).toBeGreaterThan(0);

                expect(
                    document,
                ).toContain(
                    "# Engineering Platform",
                );

                expect(
                    document,
                ).toContain(
                    "Functional Requirements",
                );

                expect(
                    document,
                ).toContain(
                    "Non-Functional Requirements",
                );

                //
                // Traceability
                //
                // The final document must retain
                // traceability to the validated
                // requirements artifact.
                //

                expect(
                    artifact?.parents,
                ).toHaveLength(1);

                expect(
                    artifact?.parents[0]?.type,
                ).toBe(
                    "VALIDATED_REQUIREMENTS",
                );

                //
                // Execution timing
                //

                expect(
                    execution.metadata.completedAt!.getTime(),
                ).toBeGreaterThanOrEqual(
                    execution.metadata.startedAt.getTime(),
                );

            },

            120_000,

        );

    },
);
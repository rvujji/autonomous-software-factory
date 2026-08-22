import {
    describe,
    expect,
    it,
} from "vitest";

import {
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    createEngineeringPlatformTestRuntime,
} from "./EngineeringPlatformTestRuntime.js";


describe(
    "AutonomousProjectFactory E2E",
    () => {

        it(
            "takes a topic and produces a real requirements document",
            async () => {

                const runtime =
                    await createEngineeringPlatformTestRuntime();

                const result =
                    await runtime.factory.execute(

                        {},

                        {

                            kind:
                                "TOPIC",

                            topic:
                                "Earth movers timing management",

                        },

                    );

                expect(
                    result.artifacts.length,
                ).toBeGreaterThanOrEqual(
                    3,
                );

                const types =
                    result.artifacts.map(
                        artifact =>
                            artifact.type,
                    );

                expect(
                    types,
                ).toContain(
                    "TOPIC_INTAKE",
                );

                expect(
                    types,
                ).toContain(
                    "WORK_PLAN",
                );

                expect(
                    types,
                ).toContain(
                    "REQUIREMENTS_DOCUMENT",
                );

                const document =
                    result.artifacts.find(
                        artifact =>
                            artifact.type ===
                            "REQUIREMENTS_DOCUMENT",
                    );

                expect(
                    document,
                ).toBeDefined();

                expect(
                    document?.state,
                ).toBe(
                    ArtifactState.CREATED,
                );

                expect(
                    typeof document?.payload,
                ).toBe(
                    "string",
                );

                expect(
                    document?.payload,
                ).toContain(
                    "Earth movers timing management",
                );

            },300_000,

        );

    },
);
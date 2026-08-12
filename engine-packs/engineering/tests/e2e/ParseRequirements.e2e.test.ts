import {
    describe,
    expect,
    it,
} from "vitest";

import {
    BackendRuntime,
    InMemoryBackendRegistry,
} from "@engineering/core/backend";

import {
    EngineRuntime,
    InMemoryEngineRegistry,
} from "@engineering/core/engine";

import {
    OpenCodeBackend,
} from "@engineering/backend-opencode";

import {
    NodeCliProcess,
} from "@engineering/backend-cli";

import {
    EngineeringEnginePack,
} from "../../src/EngineeringEnginePack.js";
import {
    ArtifactRuntime,
    InMemoryArtifactStore,
} from "@engineering/core/artifact";

import {
    SystemClock,
    UuidIdentifierGenerator,
} from "@engineering/core/foundation";
import { ArtifactState } from "@engineering/shared/artifact";

describe(
    "Requirements Engineering and Planning E2E",
    () => {

        it(
            "parses, validates, and plans a real requirements document through OpenCode",
            async () => {

                const backendRegistry =
                    new InMemoryBackendRegistry();

                await backendRegistry.register(

                    new OpenCodeBackend(

                        new NodeCliProcess(),

                        {

                            executable:
                                "opencode",

                            arguments: [],

                            format:
                                "json",

                        },

                    ),

                );

                const backendRuntime =
                    new BackendRuntime(
                        backendRegistry,
                    );

                const engineRegistry =
                    new InMemoryEngineRegistry();

                const engineRuntime =
                    new EngineRuntime(
                        engineRegistry,
                    );
                const artifactRuntime =
                    new ArtifactRuntime(

                        new InMemoryArtifactStore(),

                        new UuidIdentifierGenerator(),

                        new SystemClock(),

                    );
                const pack =
                    new EngineeringEnginePack(

                        backendRuntime,

                        engineRuntime,
                        artifactRuntime,

                    );

                for (
                    const engine
                    of pack.engines
                ) {

                    await engineRegistry.register(
                        engine,
                    );

                }

                const pipeline =
                    pack.pipelines[0];

                expect(
                    pipeline,
                ).toBeDefined();

                const result =
                    await pipeline!.execute(

                        {},

                        {

                            artifacts: [

                                {

                                    id:
                                        "requirements-source",

                                    name:
                                        "Sample Requirements",

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

                                    payload: `# Engineering Platform

                                    The platform must allow users to create engineering projects.

                                    Users must be able to authenticate securely.

                                    The system must maintain project requirements.

                                    The platform should provide reliable execution of engineering workflows.

                                    The system must preserve traceability between engineering artifacts.

                                    The platform must support modular backend execution.

                                    Security requirements must be enforced for authenticated operations.
`,

                                },

                            ],

                        },

                    );

                expect(
                    result.artifacts,
                ).toHaveLength(1);

                const artifact =
                    result.artifacts[0];

                expect(
                    artifact,
                ).toBeDefined();

                expect(
                    artifact?.type,
                ).toBe(
                    "REQUIREMENTS_PLAN",
                );

                const plan =
                    artifact?.payload as {

                        readonly name:
                            string;

                        readonly version:
                            string;

                        readonly objective:
                            string;

                        readonly steps:
                            readonly unknown[];

                        readonly dependencies:
                            readonly unknown[];

                        readonly expectedArtifacts:
                            readonly unknown[];

                        readonly constraints:
                            readonly string[];

                    };

                expect(
                    plan.name,
                ).toBe(
                    "requirements-engineering",
                );

                expect(
                    plan.version,
                ).toBeTruthy();

                expect(
                    plan.objective,
                ).toBeTruthy();

                expect(
                    plan.steps,
                ).toHaveLength(3);

                expect(
                    plan.dependencies,
                ).toHaveLength(2);

                expect(
                    plan.expectedArtifacts,
                ).toHaveLength(3);

                expect(
                    plan.steps[0],
                ).toMatchObject({

                    id:
                        "requirements-analysis",

                });

                expect(
                    plan.steps[1],
                ).toMatchObject({

                    id:
                        "requirements-design",

                });

                expect(
                    plan.steps[2],
                ).toMatchObject({

                    id:
                        "requirements-verification",

                });

            },

            60_000,

        );

    },
);
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

import {
    ArtifactState,
} from "@engineering/shared/artifact";


describe(
    "Requirements Engineering and Planning E2E",
    () => {

        it(
            "parses, validates, plans, and builds an execution graph through OpenCode",
            async () => {

                const backendRegistry =
                    new InMemoryBackendRegistry();

                await backendRegistry.register(

                    new OpenCodeBackend(

                        new NodeCliProcess(),

                        {

                            executable:
                                "opencode",

                            arguments:
                                [],

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

                                    parents:
                                        [],

                                    payload:
                                        `# Engineering Platform

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

                //
                // Final pipeline output
                //

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
                    "EXECUTION_GRAPH",
                );

                //
                // Graph payload
                //

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
                ).toBeTruthy();

                expect(
                    graph.nodes.length,
                ).toBeGreaterThan(0);

                expect(
                    graph.edges.length,
                ).toBeGreaterThan(0);

                //
                // Expected planning nodes
                //

                expect(
                    graph.nodes,
                ).toEqual(
                    expect.arrayContaining([

                        expect.objectContaining({

                            id:
                                "requirements-analysis",

                        }),

                        expect.objectContaining({

                            id:
                                "requirements-design",

                        }),

                        expect.objectContaining({

                            id:
                                "requirements-verification",

                        }),

                    ]),
                );

                //
                // Expected dependency graph
                //

                expect(
                    graph.edges,
                ).toEqual(
                    expect.arrayContaining([

                        {

                            from:
                                "requirements-analysis",

                            to:
                                "requirements-design",

                        },

                        {

                            from:
                                "requirements-design",

                            to:
                                "requirements-verification",

                        },

                    ]),
                );

                //
                // Traceability
                //

                expect(
                    artifact?.parents,
                ).toHaveLength(1);

                expect(
                    artifact?.parents[0]?.type,
                ).toBe(
                    "REQUIREMENTS_PLAN",
                );

            },

            120_000,

        );

    },
);
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
    "Requirements Engineering and Document Generation E2E",
    () => {

        it(
            "parses, validates, plans, builds the execution graph, and generates the requirements document through OpenCode",
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

                //
                // Traceability
                //

                expect(
                    artifact?.parents,
                ).toHaveLength(1);

                expect(
                    artifact?.parents[0]?.type,
                ).toBe(
                    "VALIDATED_REQUIREMENTS",
                );

            },

            120_000,

        );

    },
);
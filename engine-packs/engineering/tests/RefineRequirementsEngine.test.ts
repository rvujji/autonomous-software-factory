import {
    describe,
    expect,
    it,
} from "vitest";

import {
    RefineRequirementsEngine,
} from "../src/requirements/RefineRequirementsEngine.js";

import {
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    PlatformError,
} from "@engineering/shared/foundation";

type BackendExecuteResult = {
    readonly status: string;
    readonly outputs?: readonly {
        readonly kind: string;
        readonly content?: unknown;
    }[];
    readonly error?: {
        readonly message: string;
    };
};

function createArtifact(
    id: string,
    name: string,
    type: string,
    payload: unknown,
) {
    return {
        id,
        name,
        type,
        version: 1,
        state: ArtifactState.CREATED,
        metadata: {
            createdAt: new Date(),
        },
        parents: [],
        payload,
    };
}

function createBackend(
    result: BackendExecuteResult,
    captured?: {
        task?: unknown;
        backend?: string;
    },
) {
    return {
        async execute(
            backend: string,
            task: unknown,
        ) {

            if (captured) {
                captured.backend = backend;
                captured.task = task;
            }

            return result;
        },
    } as any;
}

function createValidRequirementSet() {
    return {
        projectName:
            "Digital Life Coach",

        version:
            "1.0.0",

        functionalRequirements: [

            {
                id:
                    "FR-001",

                title:
                    "Record Behaviour",

                description:
                    "The system shall record a user's behaviour event.",

                type:
                    "FUNCTIONAL",

                priority:
                    "HIGH",

                status:
                    "DRAFT",

                acceptanceCriteria: [

                    {
                        id:
                            "AC-FR-001-1",

                        description:
                            "A behaviour event can be recorded.",
                    },

                ],

                provenance: {

                    sourceType:
                        "RESEARCH",

                    sourceArtifactIds: [
                        "synthesis-1",
                    ],

                    rationale:
                        "The requirement is supported by the supplied behavioural findings.",
                },

            },

        ],

        nonFunctionalRequirements: [

            {

                id:
                    "NFR-001",

                title:
                    "Traceability",

                description:
                    "The system shall preserve traceability between requirements and their evidence.",

                type:
                    "NON_FUNCTIONAL",

                priority:
                    "HIGH",

                status:
                    "DRAFT",

                acceptanceCriteria: [

                    {

                        id:
                            "AC-NFR-001-1",

                        description:
                            "Every generated requirement identifies supporting provenance.",

                    },

                ],

                provenance: {

                    sourceType:
                        "RESEARCH",

                    sourceArtifactIds: [
                        "synthesis-1",
                    ],

                    rationale:
                        "The supplied knowledge identifies traceability as important to the system.",

                },

            },

        ],

        candidates: [

            {

                id:
                    "RC-001",

                title:
                    "Potential Personalisation",

                description:
                    "The system may personalise interventions based on behaviour patterns.",

                type:
                    "FUNCTIONAL",

                priority:
                    "MEDIUM",

                rationale:
                    "The supplied evidence suggests personalisation may be useful, but does not establish sufficient support for an actual requirement.",

                provenance: {

                    sourceType:
                        "RESEARCH",

                    sourceArtifactIds: [
                        "synthesis-1",
                    ],

                    rationale:
                        "This remains a candidate because the evidence is insufficient.",

                },

                confidence:
                    "MEDIUM",

            },

        ],

        constraints: [

            {

                id:
                    "C-001",

                description:
                    "The system must preserve evidence traceability.",

            },

        ],

        assumptions: [

            {

                id:
                    "A-001",

                description:
                    "Users provide sufficient behavioural data for meaningful analysis.",

            },

        ],

    };
}

describe(
    "RefineRequirementsEngine",
    () => {

        it(
            "produces a requirement set from supplied project knowledge",
            async () => {

                const payload =
                    createValidRequirementSet();

                const captured: {
                    task?: any;
                    backend?: string;
                } = {};

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {

                                        kind:
                                            "INLINE",

                                        content:
                                            JSON.stringify(
                                                payload,
                                            ),

                                    },

                                ],

                            },
                            captured,
                        ),
                    );

                const synthesis =
                    createArtifact(
                        "synthesis-1",
                        "Knowledge Synthesis",
                        "KNOWLEDGE_SYNTHESIS",
                        {
                            id:
                                "synthesis-1",

                            topic:
                                "Digital Life Coach",

                            summary:
                                "Behavioural evidence suggests that recording behaviour and maintaining traceability are important.",

                            findings: [],

                            conclusions: [
                                "Behaviour should be observable and traceable.",
                            ],

                            uncertainties: [
                                "The optimal degree of personalisation remains uncertain.",
                            ],

                            recommendations: [],
                        },
                    );

                const source =
                    createArtifact(
                        "source-1",
                        "Research Document",
                        "MARKDOWN_REQUIREMENTS",
                        "# Digital Life Coach\nResearch content.",
                    );

                const existing =
                    createArtifact(
                        "requirements-1",
                        "Existing Requirements",
                        "REQUIREMENTS",
                        {
                            projectName:
                                "Digital Life Coach",

                            version:
                                "0.9.0",
                        },
                    );

                const result =
                    await engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    source,
                                    synthesis,
                                    existing,
                                ],
                            },
                            configuration: {
                                backend:
                                    "TestBackend",
                            },
                        },
                    );

                expect(
                    result.output.artifacts,
                ).toHaveLength(1);

                const artifact =
                    result.output.artifacts[0];

                expect(
                    artifact,
                ).toBeDefined();

                expect(
                    artifact?.type,
                ).toBe(
                    "REQUIREMENT_SET",
                );

                expect(
                    artifact?.name,
                ).toBe(
                    "Requirement Set",
                );

                expect(
                    artifact?.payload,
                ).toEqual(
                    payload,
                );

                expect(
                    artifact?.parents,
                ).toHaveLength(3);

                expect(
                    artifact?.parents.map(
                        parent =>
                            parent.id,
                    ),
                ).toEqual(
                    [
                        "source-1",
                        "synthesis-1",
                        "requirements-1",
                    ],
                );

                expect(
                    captured.backend,
                ).toBe(
                    "TestBackend",
                );

                expect(
                    captured.task,
                ).toBeDefined();

            },
        );

        it(
            "passes the knowledge and existing requirements to the backend task",
            async () => {

                const captured: {
                    task?: any;
                    backend?: string;
                } = {};

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {
                                        kind:
                                            "INLINE",

                                        content:
                                            JSON.stringify(
                                                createValidRequirementSet(),
                                            ),
                                    },

                                ],

                            },
                            captured,
                        ),
                    );

                const synthesis =
                    createArtifact(
                        "synthesis-42",
                        "Knowledge Synthesis",
                        "KNOWLEDGE_SYNTHESIS",
                        {
                            topic:
                                "Market",

                            summary:
                                "Market evidence.",

                            findings: [],
                        },
                    );

                const existing =
                    createArtifact(
                        "existing-42",
                        "Existing Requirements",
                        "VALIDATED_REQUIREMENTS",
                        {
                            projectName:
                                "Test Project",
                        },
                    );

                await engine.execute(
                    {},
                    {
                        input: {
                            artifacts: [
                                synthesis,
                                existing,
                            ],
                        },
                    },
                );

                expect(
                    captured.task,
                ).toBeDefined();

                const task =
                    captured.task;

                expect(
                    task.objective,
                ).toContain(
                    "evidence-grounded",
                );

                expect(
                    task.inputs,
                ).toHaveLength(1);

                expect(
                    task.inputs[0].source.kind,
                ).toBe(
                    "CONTENT",
                );

                expect(
                    task.inputs[0].source.content,
                ).toContain(
                    "Knowledge Synthesis",
                );

                expect(
                    task.inputs[0].source.content,
                ).toContain(
                    "Existing Requirements",
                );

                expect(
                    task.instructions,
                ).toEqual(
                    expect.arrayContaining(
                        [
                            "Do not invent facts, evidence, business decisions, constraints, assumptions, or requirements.",

                            "If evidence is insufficient to justify an actual requirement, do NOT create an actual requirement.",

                            "Place a potential requirement that needs further evidence into candidates instead.",

                            "Do not convert uncertainty into a requirement.",

                            "Do not resolve conflicts between sources unless the supplied artifacts explicitly resolve them.",

                            "Every actual requirement must contain id, title, description, type, priority, status, acceptanceCriteria, and provenance.",

                        ],
                    ),
                );

            },
        );

        it(
            "defaults to OpenCode when no backend is configured",
            async () => {

                const captured: {
                    task?: unknown;
                    backend?: string;
                } = {};

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {
                                        kind:
                                            "INLINE",

                                        content:
                                            JSON.stringify(
                                                createValidRequirementSet(),
                                            ),
                                    },

                                ],

                            },
                            captured,
                        ),
                    );

                await engine.execute(
                    {},
                    {
                        input: {
                            artifacts: [
                                createArtifact(
                                    "synthesis-1",
                                    "Knowledge Synthesis",
                                    "KNOWLEDGE_SYNTHESIS",
                                    {},
                                ),
                            ],
                        },
                    },
                );

                expect(
                    captured.backend,
                ).toBe(
                    "OpenCode",
                );

            },
        );

        it(
            "fails when no input artifacts are supplied",
            async () => {

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",
                            },
                        ),
                    );

                await expect(
                    engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [],
                            },
                        },
                    ),
                ).rejects.toMatchObject({

                    code:
                        "REQUIREMENT_REFINEMENT_INPUT_MISSING",

                });

            },
        );

        it(
            "fails when knowledge synthesis is missing",
            async () => {

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",
                            },
                        ),
                    );

                await expect(
                    engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "requirements-1",
                                        "Requirements",
                                        "REQUIREMENTS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    ),
                ).rejects.toMatchObject({

                    code:
                        "KNOWLEDGE_SYNTHESIS_MISSING",

                });

            },
        );

        it(
            "converts backend failure into a platform error",
            async () => {

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "FAILED",

                                error: {

                                    message:
                                        "Backend unavailable.",

                                },

                            },
                        ),
                    );

                await expect(
                    engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "synthesis-1",
                                        "Knowledge Synthesis",
                                        "KNOWLEDGE_SYNTHESIS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    ),
                ).rejects.toMatchObject({

                    code:
                        "REQUIREMENT_REFINEMENT_BACKEND_FAILED",

                    message:
                        "Backend unavailable.",

                });

            },
        );

        it(
            "fails when backend returns no output",
            async () => {

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [],
                            },
                        ),
                    );

                await expect(
                    engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "synthesis-1",
                                        "Knowledge Synthesis",
                                        "KNOWLEDGE_SYNTHESIS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    ),
                ).rejects.toMatchObject({

                    code:
                        "REQUIREMENT_REFINEMENT_OUTPUT_MISSING",

                });

            },
        );

        it(
            "fails when backend returns non-inline output",
            async () => {

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {
                                        kind:
                                            "FILE",

                                        content:
                                            "ignored",
                                    },

                                ],
                            },
                        ),
                    );

                await expect(
                    engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "synthesis-1",
                                        "Knowledge Synthesis",
                                        "KNOWLEDGE_SYNTHESIS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    ),
                ).rejects.toMatchObject({

                    code:
                        "REQUIREMENT_REFINEMENT_OUTPUT_MISSING",

                });

            },
        );

        it(
            "fails when backend returns invalid JSON",
            async () => {

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {

                                        kind:
                                            "INLINE",

                                        content:
                                            "this is not valid JSON",

                                    },

                                ],

                            },
                        ),
                    );

                await expect(
                    engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "synthesis-1",
                                        "Knowledge Synthesis",
                                        "KNOWLEDGE_SYNTHESIS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    ),
                ).rejects.toMatchObject({

                    code:
                        "REQUIREMENT_REFINEMENT_INVALID_JSON",

                });

            },
        );

        it(
            "extracts JSON from Markdown fences",
            async () => {

                const payload =
                    createValidRequirementSet();

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {

                                        kind:
                                            "INLINE",

                                        content:
                                            [
                                                "```json",
                                                JSON.stringify(
                                                    payload,
                                                ),
                                                "```",
                                            ].join("\n"),

                                    },

                                ],

                            },
                        ),
                    );

                const result =
                    await engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "synthesis-1",
                                        "Knowledge Synthesis",
                                        "KNOWLEDGE_SYNTHESIS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    );

                expect(
                    result.output.artifacts?.[0]?.payload,
                ).toEqual(
                    payload,
                );

            },
        );

        it(
            "extracts JSON when backend surrounds it with prose",
            async () => {

                const payload =
                    createValidRequirementSet();

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {

                                        kind:
                                            "INLINE",

                                        content:
                                            [
                                                "Here is the result:",
                                                JSON.stringify(
                                                    payload,
                                                ),
                                                "End of result.",
                                            ].join("\n"),

                                    },

                                ],

                            },
                        ),
                    );

                const result =
                    await engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "synthesis-1",
                                        "Knowledge Synthesis",
                                        "KNOWLEDGE_SYNTHESIS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    );

                expect(
                    result.output.artifacts?.[0]?.payload,
                ).toEqual(
                    payload,
                );

            },
        );

        it(
            "wraps unexpected backend errors as platform errors",
            async () => {

                const backend = {

                    async execute() {

                        throw new Error(
                            "Unexpected backend exception.",
                        );

                    },

                } as any;

                const engine =
                    new RefineRequirementsEngine(
                        backend,
                    );

                await expect(
                    engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "synthesis-1",
                                        "Knowledge Synthesis",
                                        "KNOWLEDGE_SYNTHESIS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    ),
                ).rejects.toMatchObject({

                    code:
                        "REQUIREMENT_REFINEMENT_FAILED",

                    message:
                        "Unexpected backend exception.",

                });

            },
        );

        it(
            "preserves source artifact identity through parents",
            async () => {

                const sourceArtifacts = [

                    createArtifact(
                        "research-1",
                        "Market Research",
                        "RESEARCH_SOURCE",
                        {
                            topic:
                                "Market",
                        },
                    ),

                    createArtifact(
                        "findings-1",
                        "Knowledge Findings",
                        "KNOWLEDGE_FINDINGS",
                        {
                            findings: [],
                        },
                    ),

                    createArtifact(
                        "synthesis-1",
                        "Knowledge Synthesis",
                        "KNOWLEDGE_SYNTHESIS",
                        {
                            topic:
                                "Market",
                        },
                    ),

                ];

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {
                                        kind:
                                            "INLINE",

                                        content:
                                            JSON.stringify(
                                                createValidRequirementSet(),
                                            ),
                                    },

                                ],
                            },
                        ),
                    );

                const result =
                    await engine.execute(
                        {},
                        {
                            input: {
                                artifacts:
                                    sourceArtifacts,
                            },
                        },
                    );

                expect(
                    result.output.artifacts?.[0]?.parents.map(
                        parent =>
                            parent.id,
                    ),
                ).toEqual(
                    [
                        "research-1",
                        "findings-1",
                        "synthesis-1",
                    ],
                );

            },
        );

        it(
            "produces an artifact with the expected lifecycle metadata",
            async () => {

                const engine =
                    new RefineRequirementsEngine(
                        createBackend(
                            {
                                status:
                                    "SUCCEEDED",

                                outputs: [

                                    {

                                        kind:
                                            "INLINE",

                                        content:
                                            JSON.stringify(
                                                createValidRequirementSet(),
                                            ),

                                    },

                                ],

                            },
                        ),
                    );

                const result =
                    await engine.execute(
                        {},
                        {
                            input: {
                                artifacts: [
                                    createArtifact(
                                        "synthesis-1",
                                        "Knowledge Synthesis",
                                        "KNOWLEDGE_SYNTHESIS",
                                        {},
                                    ),
                                ],
                            },
                        },
                    );

                const artifact =
                    result.output.artifacts?.[0];

                expect(
                    artifact?.version,
                ).toBe(
                    1,
                );

                expect(
                    artifact?.state,
                ).toBe(
                    ArtifactState.CREATED,
                );

                expect(
                    artifact?.metadata.createdAt,
                ).toBeInstanceOf(
                    Date,
                );

            },
        );

    },
);
import {
    Artifact,
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
    EngineSpecification,
    EngineType,
} from "@engineering/shared/engine";

import {
    BackendRuntime,
} from "@engineering/core/backend";

import {
    BackendTask,
} from "@engineering/backend-shared";

import {
    PlatformError,
} from "@engineering/shared/foundation";

export class RefineRequirementsEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.refine-requirements",

        displayName:
            "Refine Requirements",

        type:
            "REFINER" as EngineType,

        metadata: {

            version:
                "1.0.0",

        },

    };

    constructor(
        private readonly backends: BackendRuntime,
    ) {}

    async execute(
        context: EngineContext,
        request: EngineRequest,
    ): Promise<EngineResult> {

        console.log(
            "[REQUIREMENT-REFINEMENT] start",
        );

        const sourceArtifacts =
            request.input.artifacts;

        if (
            sourceArtifacts.length === 0
        ) {

            throw new PlatformError(
                "REQUIREMENT_REFINEMENT_INPUT_MISSING",
                "Requirement refinement requires at least one input artifact.",
                {
                    component:
                        "RefineRequirementsEngine",
                },
            );

        }

        const synthesis =
            sourceArtifacts.find(
                artifact =>
                    artifact.type ===
                    "KNOWLEDGE_SYNTHESIS",
            );

        if (!synthesis) {

            throw new PlatformError(
                "KNOWLEDGE_SYNTHESIS_MISSING",
                "Requirement refinement requires a KNOWLEDGE_SYNTHESIS artifact.",
                {
                    component:
                        "RefineRequirementsEngine",

                    details: {
                        inputArtifactCount:
                            sourceArtifacts.length,
                    },
                },
            );

        }

        const existingRequirements =
            sourceArtifacts.filter(
                artifact =>
                    artifact.type ===
                    "REQUIREMENTS" ||
                    artifact.type ===
                    "VALIDATED_REQUIREMENTS",
            );

        const contextText =
            sourceArtifacts
                .map(
                    artifact =>
                        [
                            `ARTIFACT: ${artifact.name}`,
                            `TYPE: ${artifact.type}`,
                            `ID: ${artifact.id}`,
                            "CONTENT:",
                            this.serializePayload(
                                artifact.payload,
                            ),
                        ].join("\n"),
                )
                .join("\n\n---\n\n");

        const task: BackendTask = {

            contractVersion:
                "1.0",

            id:
                `refine-requirements-${synthesis.id}`,

            name:
                "Refine Requirements",

            objective:
                "Produce a coherent, evidence-grounded RequirementSet from project knowledge and existing requirement documents.",

            instructions: [

                "Read every supplied artifact completely before producing the result.",

                "Treat the KNOWLEDGE_SYNTHESIS artifact as the primary reasoning source.",

                "Use existing REQUIREMENTS and VALIDATED_REQUIREMENTS artifacts as existing project requirements.",

                "Preserve valid existing requirements unless supplied evidence or an explicit business decision requires modification.",

                "Do not silently delete an existing requirement.",

                "Do not invent facts, evidence, business decisions, constraints, assumptions, or requirements.",

                "Every actual requirement must be supported by supplied evidence, an existing requirement, or an explicit decision contained in the supplied artifacts.",

                "If evidence is insufficient to justify an actual requirement, do NOT create an actual requirement.",

                "Place a potential requirement that needs further evidence into candidates instead.",

                "Use candidates for plausible requirements that are not sufficiently supported for inclusion as actual requirements.",

                "Do not convert uncertainty into a requirement.",

                "Do not convert a research gap into a requirement.",

                "Do not resolve conflicts between sources unless the supplied artifacts explicitly resolve them.",

                "Preserve unresolved uncertainty through candidate rationale or other supplied knowledge artifacts.",

                "Merge duplicate or substantially overlapping requirements when they clearly represent the same requirement.",

                "Do not merge requirements merely because they are related.",

                "Separate functional and non-functional requirements correctly.",

                "functionalRequirements MUST contain only requirements whose type is FUNCTIONAL.",

                "nonFunctionalRequirements MUST contain only requirements whose type is NON_FUNCTIONAL.",

                "Every actual requirement must contain id, title, description, type, priority, status, acceptanceCriteria, and provenance.",

                "Every acceptance criterion must contain id and description.",

                "Every actual requirement provenance must contain sourceType, sourceArtifactIds, and a rationale.",

                "sourceArtifactIds must contain IDs of supplied artifacts that support the requirement.",

                "The provenance rationale must explain why the cited evidence supports the requirement.",

                "When relevant, mention supporting knowledge finding IDs inside the provenance rationale.",

                "Every candidate must contain id, title, description, type, priority, rationale, provenance, and confidence.",

                "Every candidate provenance must contain sourceType, sourceArtifactIds, and may contain rationale.",

                "Every candidate must explain why it is not sufficiently supported to become an actual requirement.",

                "Every constraint must contain id and description.",

                "Every assumption must contain id and description.",

                "Requirement status represents lifecycle state, not validation success.",

                "Newly generated requirements MUST use DRAFT status unless an existing supplied requirement explicitly carries a different lifecycle status and that status is preserved.",

                "Never manufacture APPROVED, IMPLEMENTED, or VERIFIED status.",

                "Requirement IDs must be unique across functionalRequirements and nonFunctionalRequirements.",

                "Candidate IDs must be unique.",

                "Acceptance criterion IDs must be unique within each requirement.",

                "Return exactly one JSON object.",

                "The JSON object MUST contain exactly these top-level fields: projectName, version, functionalRequirements, nonFunctionalRequirements, candidates, constraints, assumptions.",

                "functionalRequirements MUST be an array.",

                "nonFunctionalRequirements MUST be an array.",

                "candidates MUST be an array.",

                "constraints MUST be an array.",

                "assumptions MUST be an array.",

                "Do not return a sources field.",

                "Do not return a requirements field.",

                "Do not return Markdown fences.",

                "Do not return explanatory prose.",

                "Return only the JSON object.",

            ],

            inputs: [

                {

                    id:
                        "project-knowledge",

                    name:
                        "Project Knowledge and Requirements",

                    type:
                        "ENGINEERING_KNOWLEDGE",

                    required:
                        true,

                    source: {

                        kind:
                            "CONTENT",

                        content:
                            contextText,

                    },

                    metadata: {

                        existingRequirementDocuments:
                            existingRequirements.length,

                        synthesisArtifactId:
                            synthesis.id,

                    },

                },

            ],

            context: [],

            expectedOutputs: [

                {

                    id:
                        "requirement-set",

                    name:
                        "Requirement Set",

                    type:
                        "REQUIREMENT_SET",

                    required:
                        true,

                },

            ],

            metadata: {

                engine:
                    this.specification.name,

            },

        };

        const backendName =
            typeof request.configuration?.backend === "string"
                ? request.configuration.backend
                : "OpenCode";

        console.log(
            "[REQUIREMENT-REFINEMENT] backend:start",
            {
                backend:
                    backendName,

                synthesisArtifactId:
                    synthesis.id,

                sourceArtifactCount:
                    sourceArtifacts.length,
            },
        );

        try {

            const result =
                await this.backends.execute(
                    backendName,
                    task,
                );

            if (
                result.status !== "SUCCEEDED"
            ) {

                throw new PlatformError(
                    "REQUIREMENT_REFINEMENT_BACKEND_FAILED",
                    result.error?.message ??
                        "Requirement refinement backend failed.",
                    {
                        component:
                            "RefineRequirementsEngine",

                        details: {
                            backend:
                                backendName,

                            synthesisArtifactId:
                                synthesis.id,

                            status:
                                result.status,
                        },
                    },
                );

            }

            const output =
                result.outputs[0];

            if (
                !output ||
                output.kind !== "INLINE"
            ) {

                throw new PlatformError(
                    "REQUIREMENT_REFINEMENT_OUTPUT_MISSING",
                    "Requirement refinement backend did not return inline output.",
                    {
                        component:
                            "RefineRequirementsEngine",
                    },
                );

            }

            if (
                typeof output.content !== "string"
            ) {

                throw new PlatformError(
                    "REQUIREMENT_REFINEMENT_OUTPUT_INVALID",
                    "Requirement refinement backend returned non-text output.",
                    {
                        component:
                            "RefineRequirementsEngine",
                    },
                );

            }

            const payload =
                this.parseJson(
                    output.content,
                );

            const artifact: Artifact = {

                id:
                    `requirement-set-${synthesis.id}`,

                name:
                    "Requirement Set",

                type:
                    "REQUIREMENT_SET",

                version:
                    1,

                state:
                    ArtifactState.CREATED,

                metadata: {

                    createdAt:
                        new Date(),

                },

                parents:
                    sourceArtifacts.map(
                        artifact => ({

                            id:
                                artifact.id,

                            version:
                                artifact.version,

                            type:
                                artifact.type,

                            name:
                                artifact.name,

                        }),
                    ),

                payload,

            };

            console.log(
                "[REQUIREMENT-REFINEMENT] done",
                {
                    artifactId:
                        artifact.id,
                },
            );

            return {

                output: {

                    artifacts: [

                        artifact,

                    ],

                },

            };

        }
        catch (error) {

            const message =
                error instanceof Error
                    ? error.message
                    : "Requirement refinement failed.";

            console.error(
                "[REQUIREMENT-REFINEMENT] failed",
                {
                    synthesisArtifactId:
                        synthesis.id,

                    error:
                        message,
                },
            );

            if (
                error instanceof PlatformError
            ) {

                throw error;

            }

            throw new PlatformError(
                "REQUIREMENT_REFINEMENT_FAILED",
                message,
                {
                    component:
                        "RefineRequirementsEngine",

                    details: {
                        synthesisArtifactId:
                            synthesis.id,

                        backend:
                            backendName,
                    },

                    cause:
                        error,
                },
            );

        }

    }

    private parseJson(
        text: string,
    ): unknown {

        const trimmed =
            text.trim();

        const json =
            this.extractJson(
                trimmed,
            );

        try {

            return JSON.parse(
                json,
            );

        }
        catch (error) {

            throw new PlatformError(
                "REQUIREMENT_REFINEMENT_INVALID_JSON",
                "Requirement refinement backend returned invalid JSON.",
                {
                    component:
                        "RefineRequirementsEngine",

                    details: {
                        outputLength:
                            text.length,
                    },

                    cause:
                        error,
                },
            );

        }

    }

    private extractJson(
        text: string,
    ): string {

        if (
            text.startsWith("```")
        ) {

            const withoutOpeningFence =
                text.replace(
                    /^```(?:json)?\s*/i,
                    "",
                );

            return withoutOpeningFence
                .replace(
                    /\s*```$/,
                    "",
                )
                .trim();

        }

        const objectStart =
            text.indexOf("{");

        const objectEnd =
            text.lastIndexOf("}");

        if (
            objectStart >= 0 &&
            objectEnd > objectStart
        ) {

            return text.slice(
                objectStart,
                objectEnd + 1,
            );

        }

        return text;

    }

    private serializePayload(
        payload: unknown,
    ): string {

        if (
            typeof payload === "string"
        ) {

            return payload;

        }

        try {

            return JSON.stringify(
                payload,
                null,
                2,
            );

        }
        catch {

            return String(
                payload,
            );

        }

    }

}
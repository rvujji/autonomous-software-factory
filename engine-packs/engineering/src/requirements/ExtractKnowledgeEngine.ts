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
    BackendTask,
} from "@engineering/backend-shared";

import {
    BackendRuntime,
} from "@engineering/core/backend";

export class ExtractKnowledgeEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.extract-knowledge",

        displayName:
            "Extract Knowledge",

        type:
            "RESEARCH" as EngineType,

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

        if (
            request.input.artifacts.length === 0
        ) {

            throw new Error(
                "Extract Knowledge requires at least one source artifact.",
            );

        }

        const sourceArtifacts =
            request.input.artifacts;

        const sources =
            sourceArtifacts
                .map(
                    artifact =>
                        [
                            `SOURCE: ${artifact.name}`,
                            `ARTIFACT_ID: ${artifact.id}`,
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
                "extract-knowledge",

            name:
                "Extract Project Knowledge",

            objective:
                "Extract evidence-grounded project knowledge from the supplied source artifacts.",

            instructions: [

                "Read every supplied source completely before producing the result.",

                "Treat the supplied sources as the only evidence.",

                "Do not invent facts, users, requirements, market information, technical details, or conclusions.",

                "Extract only findings that are directly supported by the supplied sources.",

                "Each finding must identify the source artifact that supports it.",

                "Use confidence HIGH, MEDIUM, or LOW.",

                "Record an implication only when it follows directly from the finding.",

                "Record an unanswered question only when the supplied sources leave an important decision-relevant gap.",

                "Identify contradictions only when two supplied sources actually disagree.",

                "Do not infer contradictions merely because information is missing.",

                "Do not repeat the source documents.",

                "Prefer a small number of meaningful findings over many trivial findings.",

                "Return exactly one JSON object.",

                "The JSON object must contain exactly these top-level fields: artifactType, topic, findings, contradictions, openQuestions.",

                "artifactType must be exactly KNOWLEDGE_FINDINGS.",

                "topic must be a string.",

                "findings must be an array.",

                "Each finding must contain exactly these fields: id, finding, sourceArtifactId, confidence.",

                "The optional implications field may be included only when an implication is directly supported by the finding.",

                "contradictions must be an array.",

                "Each contradiction must contain exactly these fields: description, sourceArtifactIds.",

                "openQuestions must be an array.",

                "Each open question must contain exactly these fields: id, question, relatedArtifacts, priority.",

                "priority must be HIGH, MEDIUM, or LOW.",

                "Do not include sources, sourcesReviewed, findingsExtra, unused, unansweredQuestionsNote, or any other fields.",

                "Use valid JSON syntax only.",

                "Every property name must use double quotes.",

                "Every string must use valid JSON escaping.",

                "Do not use trailing commas.",

                "Do not use comments.",

                "Do not use Markdown fences.",

                "Do not return explanatory prose.",

                "The response must be directly parseable by JSON.parse().",

            ],

            inputs: [

                {

                    id:
                        "project-sources",

                    name:
                        "Project Sources",

                    type:
                        "DOCUMENT_SET",

                    required:
                        true,

                    source: {

                        kind:
                            "CONTENT",

                        content:
                            sources,

                    },

                    metadata: {},

                },

            ],

            context: [],

            expectedOutputs: [

                {

                    id:
                        "knowledge-findings",

                    name:
                        "Knowledge Findings",

                    type:
                        "KNOWLEDGE_FINDINGS",

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

        const output =
            await this.executeWithJsonRetry(
                backendName,
                task,
            );

        const artifact: Artifact = {

            id:
                `knowledge-findings-${Date.now()}`,

            name:
                "Knowledge Findings",

            type:
                "KNOWLEDGE_FINDINGS",

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

            payload:
                output,

        };

        return {

            output: {

                artifacts: [

                    artifact,

                ],

            },

        };

    }

    private async executeWithJsonRetry(
        backendName: string,
        task: BackendTask,
    ): Promise<unknown> {

        const maxAttempts =
            2;

        let lastOutput:
            string | undefined;

        let lastError:
            unknown;

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            console.debug(
                "[REFINEMENT] knowledge:extract:attempt",
                {
                    attempt,
                    maxAttempts,
                },
            );

            const currentTask =
                attempt === 1
                    ? task
                    : this.createJsonRepairTask(
                        task,
                        lastOutput ?? "",
                    );

            const startedAt =
                Date.now();

            const result =
                await this.backends.execute(
                    backendName,
                    currentTask,
                );

            console.debug(
                "[REFINEMENT] knowledge:extract:backend-done",
                {
                    attempt,
                    durationMs:
                        Date.now() -
                        startedAt,
                },
            );

            if (
                result.status !== "SUCCEEDED"
            ) {

                throw new Error(
                    result.error?.message ??
                    "Knowledge extraction failed.",
                );

            }

            const output =
                result.outputs[0];

            if (
                !output ||
                output.kind !== "INLINE" ||
                typeof output.content !== "string"
            ) {

                throw new Error(
                    "Knowledge extraction backend returned invalid output.",
                );

            }

            lastOutput =
                output.content;

            try {

                const parsed =
                    JSON.parse(
                        output.content,
                    );

                this.validatePayload(
                    parsed,
                );

                return parsed;

            }
            catch (error) {

                lastError =
                    error;

                console.warn(
                    "[REFINEMENT] knowledge:extract:invalid-json",
                    {

                        attempt,

                        maxAttempts,

                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),

                        outputLength:
                            output.content.length,

                        outputPreview:
                            output.content.slice(
                                0,
                                1500,
                            ),

                    },
                );

            }

        }

        throw new Error(
            "Knowledge extraction backend returned invalid JSON after retry.",
            {
                cause:
                    lastError,
            },
        );

    }

    private createJsonRepairTask(
        originalTask: BackendTask,
        malformedOutput: string,
    ): BackendTask {

        return {

            ...originalTask,

            id:
                `${originalTask.id}-json-repair`,

            name:
                "Repair Knowledge Extraction JSON",

            objective:
                "Repair the supplied knowledge extraction response into valid JSON without changing its meaning.",

            instructions: [

                "The previous response is malformed JSON.",

                "Repair syntax only.",

                "Do not add facts.",

                "Do not remove meaningful findings.",

                "Do not reinterpret findings.",

                "Do not change confidence values.",

                "Do not change source artifact identifiers.",

                "Do not create new questions.",

                "Do not create new contradictions.",

                "Return exactly one JSON object.",

                "The repaired object must contain exactly these top-level fields: artifactType, topic, findings, contradictions, openQuestions.",

                "Do not include any additional fields.",

                "Every property name must use double quotes.",

                "Every string must use valid JSON escaping.",

                "Remove all trailing commas.",

                "Remove all comments.",

                "Do not use Markdown fences.",

                "Do not return explanatory prose.",

                "Return only the repaired JSON object.",

            ],

            inputs: [

                {

                    id:
                        "malformed-knowledge-findings",

                    name:
                        "Previous Knowledge Findings Response",

                    type:
                        "DOCUMENT",

                    required:
                        true,

                    source: {

                        kind:
                            "CONTENT",

                        content:
                            malformedOutput,

                    },

                    metadata: {},

                },

            ],

        };

    }

    private validatePayload(
        payload: unknown,
    ): void {

        if (
            typeof payload !== "object" ||
            payload === null ||
            Array.isArray(payload)
        ) {

            throw new Error(
                "Knowledge extraction result must be a JSON object.",
            );

        }

        const object =
            payload as Record<string, unknown>;

        const allowedFields =
            new Set([

                "artifactType",
                "topic",
                "findings",
                "contradictions",
                "openQuestions",

            ]);

        for (
            const key
            of Object.keys(object)
        ) {

            if (
                !allowedFields.has(key)
            ) {

                throw new Error(
                    `Knowledge extraction result contains unexpected field: ${key}`,
                );

            }

        }

        if (
            object.artifactType !==
            "KNOWLEDGE_FINDINGS"
        ) {

            throw new Error(
                "Knowledge extraction result has invalid artifactType.",
            );

        }

        if (
            typeof object.topic !==
            "string"
        ) {

            throw new Error(
                "Knowledge extraction result has invalid topic.",
            );

        }

        if (
            !Array.isArray(
                object.findings,
            )
        ) {

            throw new Error(
                "Knowledge extraction result has invalid findings.",
            );

        }

        if (
            !Array.isArray(
                object.contradictions,
            )
        ) {

            throw new Error(
                "Knowledge extraction result has invalid contradictions.",
            );

        }

        if (
            !Array.isArray(
                object.openQuestions,
            )
        ) {

            throw new Error(
                "Knowledge extraction result has invalid openQuestions.",
            );

        }

        for (
            const finding
            of object.findings
        ) {

            if (
                typeof finding !==
                "object" ||
                finding === null ||
                Array.isArray(finding)
            ) {

                throw new Error(
                    "Knowledge extraction result contains an invalid finding.",
                );

            }

            const item =
                finding as Record<string, unknown>;

            if (
                typeof item.id !== "string" ||
                typeof item.finding !== "string" ||
                typeof item.sourceArtifactId !== "string"
            ) {

                throw new Error(
                    "Knowledge extraction result contains a finding with invalid fields.",
                );

            }

            if (
                item.confidence !== "HIGH" &&
                item.confidence !== "MEDIUM" &&
                item.confidence !== "LOW"
            ) {

                throw new Error(
                    "Knowledge extraction result contains a finding with invalid confidence.",
                );

            }

        }

        for (
            const contradiction
            of object.contradictions
        ) {

            if (
                typeof contradiction !==
                "object" ||
                contradiction === null ||
                Array.isArray(contradiction)
            ) {

                throw new Error(
                    "Knowledge extraction result contains an invalid contradiction.",
                );

            }

            const item =
                contradiction as Record<string, unknown>;

            if (
                typeof item.description !==
                "string" ||
                !Array.isArray(
                    item.sourceArtifactIds,
                )
            ) {

                throw new Error(
                    "Knowledge extraction result contains an invalid contradiction.",
                );

            }

        }

        for (
            const question
            of object.openQuestions
        ) {

            if (
                typeof question !==
                "object" ||
                question === null ||
                Array.isArray(question)
            ) {

                throw new Error(
                    "Knowledge extraction result contains an invalid open question.",
                );

            }

            const item =
                question as Record<string, unknown>;

            if (
                typeof item.id !== "string" ||
                typeof item.question !== "string" ||
                !Array.isArray(
                    item.relatedArtifacts,
                )
            ) {

                throw new Error(
                    "Knowledge extraction result contains an invalid open question.",
                );

            }

            if (
                item.priority !== "HIGH" &&
                item.priority !== "MEDIUM" &&
                item.priority !== "LOW"
            ) {

                throw new Error(
                    "Knowledge extraction result contains an open question with invalid priority.",
                );

            }

        }

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
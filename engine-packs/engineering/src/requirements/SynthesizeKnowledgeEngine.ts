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

export class SynthesizeKnowledgeEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.synthesize-knowledge",

        displayName:
            "Synthesize Knowledge",

        type:
            "SYNTHESIZER" as EngineType,

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

        const findingsArtifact =
            request.input.artifacts.find(
                artifact =>
                    artifact.type ===
                    "KNOWLEDGE_FINDINGS",
            );

        if (!findingsArtifact) {

            throw new Error(
                "Knowledge synthesis requires a KNOWLEDGE_FINDINGS artifact.",
            );

        }

        const task: BackendTask = {

            contractVersion:
                "1.0",

            id:
                `synthesize-knowledge-${findingsArtifact.id}`,

            name:
                "Synthesize Project Knowledge",

            objective:
                "Synthesize extracted findings into a coherent evidence-grounded project knowledge model.",

            instructions: [

                "Use only the supplied findings.",

                "Do not invent evidence.",

                "Group related findings.",

                "Identify important decisions supported by the evidence.",

                "Identify unresolved research gaps.",

                "Identify conflicts where findings disagree.",

                "Preserve source finding IDs.",

                "Do not silently resolve contradictions.",

                "Keep the response concise enough to complete the entire JSON document.",

                "Prefer concise statements over verbose explanations.",

                "Return exactly one JSON object.",

                "The JSON object MUST contain exactly these top-level fields: id, topic, summary, findings, conclusions, uncertainties, recommendations.",

                "id MUST be a non-empty string.",

                "topic MUST be a non-empty string.",

                "summary MUST be a string.",

                "findings MUST be an array.",

                "Every finding MUST contain exactly these fields: id, sourceId, statement, evidence, confidence, implications.",

                "finding.id MUST be a non-empty string.",

                "finding.sourceId MUST identify the supplied source finding.",

                "finding.statement MUST be a non-empty string.",

                "finding.evidence MUST be a non-empty string.",

                "finding.confidence MUST be exactly one of: HIGH, MEDIUM, LOW.",

                "finding.implications MUST be an array of strings.",

                "conclusions MUST be an array of strings.",

                "uncertainties MUST be an array of strings.",

                "recommendations MUST be an array of strings.",

                "Preserve the supplied finding IDs and source IDs.",

                "Do not invent findings or evidence.",

                "Do not add fields outside the specified schema.",

                "Use valid JSON syntax only.",

                "Every property name must use double quotes.",

                "Every string must use valid JSON string escaping.",

                "Do not use trailing commas.",

                "Do not use comments.",

                "Do not use Markdown fences.",

                "Do not return explanatory prose.",

                "Return only the JSON object.",

                "The response must be directly parseable by JSON.parse().",

            ],

            inputs: [

                {

                    id:
                        "findings",

                    name:
                        findingsArtifact.name,

                    type:
                        "KNOWLEDGE_FINDINGS",

                    required:
                        true,

                    source: {

                        kind:
                            "CONTENT",

                        content:
                            this.serializePayload(
                                findingsArtifact.payload,
                            ),

                    },

                    metadata: {},

                },

            ],

            context: [],

            expectedOutputs: [

                {

                    id:
                        "knowledge-synthesis",

                    name:
                        "Knowledge Synthesis",

                    type:
                        "KNOWLEDGE_SYNTHESIS",

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

        const payload =
            await this.executeWithJsonRetry(
                backendName,
                task,
            );

        const artifact: Artifact = {

            id:
                `knowledge-synthesis-${findingsArtifact.id}`,

            name:
                "Knowledge Synthesis",

            type:
                "KNOWLEDGE_SYNTHESIS",

            version:
                1,

            state:
                ArtifactState.CREATED,

            metadata: {

                createdAt:
                    new Date(),

            },

            parents: [

                {

                    id:
                        findingsArtifact.id,

                    version:
                        findingsArtifact.version,

                    type:
                        findingsArtifact.type,

                    name:
                        findingsArtifact.name,

                },

            ],

            payload,

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
                "[REFINEMENT] knowledge:synthesize:attempt",
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
                        task.inputs[0]?.source ??
                            {
                                kind:
                                    "CONTENT",

                                content:
                                    "",
                            },
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
                "[REFINEMENT] knowledge:synthesize:backend-done",
                {
                    attempt,
                    durationMs:
                        Date.now() - startedAt,
                },
            );

            if (
                result.status !== "SUCCEEDED"
            ) {

                throw new Error(
                    result.error?.message ??
                    "Knowledge synthesis failed.",
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
                    "Knowledge synthesis backend returned invalid output.",
                );

            }

            lastOutput =
                output.content;

            try {

                return JSON.parse(
                    output.content,
                );

            }
            catch (error) {

                lastError =
                    error;

                console.warn(
                    "[REFINEMENT] knowledge:synthesize:invalid-json",
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
                                1000,
                            ),
                        outputTail:
                            output.content.slice(
                                -1000,
                            ),
                    },
                );

            }

        }

        throw new Error(
            "Knowledge synthesis backend returned invalid JSON after retry.",
            {
                cause:
                    lastError,
            },
        );

    }

    private createJsonRepairTask(
        originalTask: BackendTask,
        findingsSource: BackendTask["inputs"][number]["source"],
        malformedOutput: string,
    ): BackendTask {

        return {

            ...originalTask,

            id:
                `${originalTask.id}-json-repair`,

            name:
                "Repair Knowledge Synthesis JSON",

            objective:
                "Reconstruct the knowledge synthesis as one complete valid JSON object without changing the evidence or meaning.",

            instructions: [

                "The previous model response was incomplete or was not valid JSON.",

                "The previous response may have been truncated before the JSON object was completed.",

                "Use the supplied findings as the authoritative evidence.",

                "Use the previous response only as a draft of the intended synthesis.",

                "Reconstruct the complete synthesis from the supplied findings.",

                "Do not invent evidence.",

                "Do not add facts that are not supported by the supplied findings.",

                "Do not remove meaningful supplied findings.",

                "Preserve supplied finding IDs and source IDs.",

                "Preserve the semantic meaning of the previous response where it is complete.",

                "If the previous response is truncated, complete the missing JSON structure using only the supplied findings.",

                "Keep all textual fields concise so the complete JSON object can fit in the response.",

                "Return exactly one complete JSON object.",

                "The JSON object MUST contain exactly these top-level fields: id, topic, summary, findings, conclusions, uncertainties, recommendations.",

                "Every finding MUST contain exactly these fields: id, sourceId, statement, evidence, confidence, implications.",

                "finding.confidence MUST be exactly one of: HIGH, MEDIUM, LOW.",

                "finding.implications MUST be an array of strings.",

                "conclusions MUST be an array of strings.",

                "uncertainties MUST be an array of strings.",

                "recommendations MUST be an array of strings.",

                "Do not add fields outside the specified schema.",

                "Every property name must use double quotes.",

                "Every string must use valid JSON string escaping.",

                "Do not use trailing commas.",

                "Do not use comments.",

                "Do not use Markdown fences.",

                "Do not return explanatory prose.",

                "Return only the complete JSON object.",

                "The response must be directly parseable by JSON.parse().",

            ],

            inputs: [

                {

                    id:
                        "findings",

                    name:
                        "Authoritative Knowledge Findings",

                    type:
                        "KNOWLEDGE_FINDINGS",

                    required:
                        true,

                    source:
                        findingsSource,

                    metadata: {},

                },

                {

                    id:
                        "previous-response",

                    name:
                        "Previous Knowledge Synthesis Response",

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
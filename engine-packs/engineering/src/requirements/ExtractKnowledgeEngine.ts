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
                            String(artifact.payload),
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
                "Extract evidence-grounded findings from all supplied project documents.",

            instructions: [

                "Read every supplied source completely.",

                "Treat each source as evidence, not as unquestionable truth.",

                "Extract meaningful findings that can influence product, business, behavioral, domain, technical, or engineering decisions.",

                "Preserve the meaning of the sources.",

                "Do not invent facts.",

                "Every finding must identify its source artifact.",

                "Record confidence as LOW, MEDIUM, or HIGH.",

                "Identify implications when they are directly supported by the source.",

                "Identify contradictions between sources.",

                "Identify important unanswered questions.",

                "Return exactly one JSON object.",

                "Do not use Markdown fences.",

                "Do not return explanatory prose.",

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

        const result =
            await this.backends.execute(
                backendName,
                task,
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

        let payload: unknown;

        try {

            payload =
                JSON.parse(
                    output.content,
                );

        }
        catch (error) {

            throw new Error(
                "Knowledge extraction backend returned invalid JSON.",
                {
                    cause: error,
                },
            );

        }

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

}
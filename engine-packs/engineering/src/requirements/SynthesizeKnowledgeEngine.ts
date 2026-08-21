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

                "Return exactly one JSON object.",

                "Do not use Markdown fences.",

                "Do not return explanatory prose.",

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
                            findingsArtifact.payload,

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

        let payload: unknown;

        try {

            payload =
                JSON.parse(
                    output.content,
                );

        }
        catch (error) {

            throw new Error(
                "Knowledge synthesis backend returned invalid JSON.",
                {
                    cause: error,
                },
            );

        }

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

}
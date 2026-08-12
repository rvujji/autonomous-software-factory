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

export class RepairRequirementsEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.repair-requirements",

        displayName:
            "Repair Requirements",

        type:
            "REPAIR" as EngineType,

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

        const inputArtifact =
            request.input.artifacts[0];

        if (!inputArtifact) {

            throw new Error(
                "Repair Requirements requires an input artifact.",
            );

        }

        if (
            inputArtifact.type !==
            "REQUIREMENTS"
        ) {

            throw new Error(
                `Expected REQUIREMENTS artifact but received '${inputArtifact.type}'.`,
            );

        }

        const validationError =
            typeof request.configuration?.validationError === "string"
                ? request.configuration.validationError
                : "The requirements artifact failed validation.";

        const task: BackendTask = {

            contractVersion:
                "1.0",

            id:
                `repair-requirements-${inputArtifact.id}`,

            name:
                "Repair Requirements",

            objective:
                "Repair the supplied structured Requirements object so that it satisfies the requirements validation rules.",

            instructions: [

                "Preserve all valid information from the existing requirements.",

                "Do not invent new requirements unless necessary to repair the reported validation problem.",

                "Correct only the problems identified by the validation error.",

                "Every requirement must have an id, title, description, type, priority, status, and acceptance criteria.",

                "Every acceptance criterion must have an id and description.",

                "Return exactly one JSON object.",

                "Do not wrap the JSON in Markdown code fences.",

                "Do not return explanatory text.",

                "Use the exact enum values defined by the requirements contract.",

                `Validation error: ${validationError}`,

            ],

            inputs: [

                {

                    id:
                        "requirements-input",

                    name:
                        inputArtifact.name,

                    type:
                        "REQUIREMENTS",

                    required:
                        true,

                    source: {

                        kind:
                            "CONTENT",

                        content:
                            inputArtifact.payload,

                    },

                    metadata: {},

                },

            ],

            context: [],

            expectedOutputs: [

                {

                    id:
                        "requirements",

                    name:
                        "Repaired Requirements",

                    type:
                        "REQUIREMENTS",

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
                "Requirements repair failed.",
            );

        }

        const output =
            result.outputs[0];

        if (
            !output ||
            output.kind !== "INLINE"
        ) {

            throw new Error(
                "Requirements repair backend did not return inline output.",
            );

        }

        if (
            typeof output.content !== "string"
        ) {

            throw new Error(
                "Requirements repair backend returned a non-text output.",
            );

        }

        const json =
            this.extractJson(
                output.content,
            );

        const repaired =
            JSON.parse(json);

        const artifact: Artifact = {

            id:
                `repaired-requirements-${inputArtifact.id}`,

            name:
                "Repaired Requirements",

            type:
                "REQUIREMENTS",

            version:
                inputArtifact.version + 1,

            state:
                ArtifactState.CREATED,

            metadata: {

                createdAt:
                    new Date(),

            },

            parents: [

                {

                    id:
                        inputArtifact.id,

                    version:
                        inputArtifact.version,

                    type:
                        inputArtifact.type,

                    name:
                        inputArtifact.name,

                },

            ],

            payload:
                repaired,

        };

        return {

            output: {

                artifacts: [

                    artifact,

                ],

            },

        };

    }

    private extractJson(
        text: string,
    ): string {

        const trimmed =
            text.trim();

        if (
            trimmed.startsWith("```")
        ) {

            const withoutOpeningFence =
                trimmed.replace(
                    /^```(?:json)?\s*/i,
                    "",
                );

            return withoutOpeningFence.replace(
                /\s*```$/,
                "",
            ).trim();

        }

        const objectStart =
            trimmed.indexOf("{");

        const objectEnd =
            trimmed.lastIndexOf("}");

        if (
            objectStart >= 0 &&
            objectEnd > objectStart
        ) {

            return trimmed.slice(
                objectStart,
                objectEnd + 1,
            );

        }

        return trimmed;

    }

}
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
    Requirements,
    Requirement,
    AcceptanceCriterion,
    Constraint,
    Assumption,
    RequirementType,
    RequirementPriority,
    RequirementStatus,
} from "@engineering/shared/engineering";

import {
    BackendRuntime,
} from "@engineering/core/backend";

import {
    BackendTask,
} from "@engineering/backend-shared";

import {Logger,PlatformError,} from "@engineering/shared/foundation";

export class ParseRequirementsEngine
implements Engine {

    private readonly logger?: Logger;
    readonly specification: EngineSpecification = {

        name:
            "engineering.parse-requirements",

        displayName:
            "Parse Requirements",

        type:
            "PARSER" as EngineType,

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
                "Parse Requirements requires an input artifact.",
            );

        }

        const requirementTypes =
            Object.values(
                RequirementType,
            ).join(", ");

        const requirementPriorities =
            Object.values(
                RequirementPriority,
            ).join(", ");

        const requirementStatuses =
            Object.values(
                RequirementStatus,
            ).join(", ");
            
        const task: BackendTask = {

            contractVersion:
                "1.0",

            id:
                `parse-requirements-${inputArtifact.id}`,

            name:
                "Parse Requirements",

            objective:
                "Transform the supplied requirements document into a structured Requirements object.",

            instructions: [
                "Read the entire supplied document before responding.",

                "Your response must be a single valid JSON object.",

                "The first character of your response must be '{'.",

                "The last character of your response must be '}'.",

                "Never respond with prose such as 'The source...', 'I cannot...', 'Here is...', or an explanation.",

                "projectName must always be present and must be a concise name derived from the source document. If the source does not explicitly state a project name, derive a reasonable project name from the document title or subject matter.",

                "Return an object with exactly these top-level fields: projectName, version, functionalRequirements, nonFunctionalRequirements, constraints, assumptions.",

                "If the source document contains insufficient detail, still produce the required JSON structure using only information explicitly present in the source.",

                "Do not describe what you found. Encode the result directly in the JSON object.",

                "Extract all functional requirements.",

                "Extract all non-functional requirements.",

                "Extract all constraints.",

                "Extract all assumptions.",

                "Preserve the meaning of the source requirements.",

                "Do not invent requirements, constraints, assumptions, or acceptance criteria.",

                "Every requirement must have an id, title, description, type, priority, status, and acceptance criteria.",

                "Every acceptance criterion must have an id and description.",

                "Return exactly one JSON object.",

                "Do not wrap the JSON in Markdown code fences.",

                "Do not return explanatory text.",

                `Requirement type MUST be exactly one of: ${requirementTypes}.`,

                `Requirement priority MUST be exactly one of: ${requirementPriorities}.`,

                `Requirement status MUST be exactly one of: ${requirementStatuses}.`,

                "Do not use values outside the enumerated values above.",

                "Every functional requirement must use the functional requirement type.",

                "Every non-functional requirement must use the non-functional requirement type.",

            ],

            inputs: [

                {

                    id:
                        "requirements-source",

                    name:
                        inputArtifact.name,

                    type:
                        "DOCUMENT",

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
                        "Structured Requirements",

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
                "Requirements parsing failed.",
            );

        }

        const output =
            result.outputs[0];

        if (
            !output ||
            output.kind !== "INLINE"
        ) {

            throw new Error(
                "Requirements parser backend did not return inline output.",
            );

        }

        if (
            typeof output.content !== "string"
        ) {

            throw new Error(
                "Requirements parser backend returned a non-text output.",
            );

        }

        const requirements =
            this.parseRequirements(
                output.content,
            );

        const artifact: Artifact = {

            id:
                `requirements-${inputArtifact.id}`,

            name:
                "Parsed Requirements",

            type:
                "REQUIREMENTS",

            version:
                1,

            state:
                ArtifactState.CREATED,

            metadata: {

                createdAt:
                    new Date(),

            },

            parents:
                request.input.artifacts,

            payload:
                requirements,

        };

        return {

            output: {

                artifacts: [

                    artifact,

                ],

            },

        };

    }

    private parseRequirements(
        text: string,
    ): Requirements {

        const json =
            this.extractJson(
                text,
            );

        const parsed: unknown =
            JSON.parse(json);

        this.assertObject(
            parsed,
            "Requirements response",
        );

        return {

            projectName:
                this.requiredString(
                    parsed,
                    "projectName",
                ),

            version:
                this.requiredString(
                    parsed,
                    "version",
                ),

            functionalRequirements:
                this.parseRequirementsArray(
                    parsed,
                    "functionalRequirements",
                    RequirementType.FUNCTIONAL,
                ),

            nonFunctionalRequirements:
                this.parseRequirementsArray(
                    parsed,
                    "nonFunctionalRequirements",
                    RequirementType.NON_FUNCTIONAL,
                ),

            constraints:
                this.parseConstraints(
                    parsed,
                ),

            assumptions:
                this.parseAssumptions(
                    parsed,
                ),

        };

    }

    private extractJson(
        text: string,
    ): string {

        const trimmed =
            text.trim();

        this.logger?.debug(
            "Requirements JSON extraction started.",
            {
                inputLength:
                    text.length,

                trimmedLength:
                    trimmed.length,

                inputPreview:
                    trimmed.slice(0, 500),

                inputTail:
                    trimmed.slice(-500),
            },
        );

        //
        // Remove Markdown code fences if present.
        //

        let candidate =
            trimmed;

        if (
            candidate.startsWith("```")
        ) {

            candidate =
                candidate.replace(
                    /^```(?:json)?\s*/i,
                    "",
                );

            candidate =
                candidate.replace(
                    /\s*```$/,
                    "",
                ).trim();

            this.logger?.debug(
                "Requirements JSON Markdown fence removed.",
                {
                    candidateLength:
                        candidate.length,
                },
            );

        }

        //
        // Locate the beginning of the JSON object.
        //

        const objectStart =
            candidate.indexOf("{");

        if (
            objectStart < 0
        ) {

            this.logger?.error(
                "Requirements JSON object start not found.",
                {
                    candidateLength:
                        candidate.length,

                    candidatePreview:
                        candidate.slice(0, 500),
                },
            );

            return candidate;

        }

        //
        // Extract exactly one balanced JSON object.
        //
        // This avoids relying on lastIndexOf("}"),
        // which can accidentally include trailing content.
        //

        let depth = 0;
        let inString = false;
        let escaped = false;

        for (
            let index = objectStart;
            index < candidate.length;
            index++
        ) {

            const character =
                candidate[index];

            if (inString) {

                if (escaped) {

                    escaped =
                        false;

                    continue;

                }

                if (
                    character === "\\"
                ) {

                    escaped =
                        true;

                    continue;

                }

                if (
                    character === "\""
                ) {

                    inString =
                        false;

                }

                continue;

            }

            if (
                character === "\""
            ) {

                inString =
                    true;

                continue;

            }

            if (
                character === "{"
            ) {

                depth++;

                continue;

            }

            if (
                character === "}"
            ) {

                depth--;

                if (
                    depth === 0
                ) {

                    const json =
                        candidate.slice(
                            objectStart,
                            index + 1,
                        );

                    this.logger?.debug(
                        "Requirements JSON object extracted.",
                        {
                            objectStart,

                            objectEnd:
                                index,

                            jsonLength:
                                json.length,

                            trailingLength:
                                candidate.length -
                                (index + 1),

                            jsonPreview:
                                json.slice(0, 500),

                            jsonTail:
                                json.slice(-500),

                            trailingPreview:
                                candidate
                                    .slice(index + 1)
                                    .trim()
                                    .slice(0, 500),
                        },
                    );

                    return json;

                }

            }

        }

        this.logger?.error(
            "Requirements JSON object was not balanced.",
            {
                objectStart,

                candidateLength:
                    candidate.length,

                remainingDepth:
                    depth,

                candidateTail:
                    candidate.slice(-500),
            },
        );

        throw new Error(
            "Requirements parser backend returned an incomplete JSON object.",
        );

    }

    private parseRequirementsArray(
        value: Record<string, unknown>,
        field: string,
        expectedType: RequirementType,
    ): readonly Requirement[] {

        const raw =
            value[field];

        if (
            !Array.isArray(raw)
        ) {

            throw new Error(
                `Requirements field '${field}' must be an array.`,
            );

        }

        return raw.map(
            (item, index) =>
                this.parseRequirement(
                    item,
                    `${field}[${index}]`,
                    expectedType,
                ),
        );

    }

    private parseRequirement(
        value: unknown,
        path: string,
        expectedType: RequirementType,
    ): Requirement {

        this.assertObject(
            value,
            path,
        );
        // console.log("[PARSE] invalid requirement type:",value.type,);
        const type =
            this.requiredEnum(
                value,
                "type",
                Object.values(RequirementType),
                path,
            );


        const acceptanceCriteria =
            value.acceptanceCriteria;

        if (
            !Array.isArray(
                acceptanceCriteria,
            )
        ) {

            throw new Error(
                `${path}.acceptanceCriteria must be an array.`,
            );

        }

        return {

            id:
                this.requiredString(
                    value,
                    "id",
                    path,
                ),

            title:
                this.requiredString(
                    value,
                    "title",
                    path,
                ),

            description:
                this.requiredString(
                    value,
                    "description",
                    path,
                ),

            type: type,

            priority:
                this.requiredEnum(
                    value,
                    "priority",
                    Object.values(RequirementPriority,),
                    path,
                ),

            status:
                this.requiredEnum(
                    value,
                    "status",
                    Object.values(RequirementStatus,),
                    path,
                )as RequirementStatus,
            acceptanceCriteria:
                acceptanceCriteria.map(
                    (criterion, index) =>
                        this.parseAcceptanceCriterion(
                            criterion,
                            `${path}.acceptanceCriteria[${index}]`,
                        ),
                ),

        };

    }

    private parseAcceptanceCriterion(
        value: unknown,
        path: string,
    ): AcceptanceCriterion {

        this.assertObject(
            value,
            path,
        );

        return {

            id:
                this.requiredString(
                    value,
                    "id",
                    path,
                ),

            description:
                this.requiredString(
                    value,
                    "description",
                    path,
                ),

        };

    }

    private parseConstraints(
        value: Record<string, unknown>,
    ): readonly Constraint[] {

        return this.parseSimpleItems(
            value,
            "constraints",
            "Constraint",
        );

    }

    private parseAssumptions(
        value: Record<string, unknown>,
    ): readonly Assumption[] {

        return this.parseSimpleItems(
            value,
            "assumptions",
            "Assumption",
        );

    }

    private parseSimpleItems<
        T extends Constraint | Assumption
    >(
        value: Record<string, unknown>,
        field: string,
        label: string,
    ): readonly T[] {

        const raw =
            value[field];

        if (
            !Array.isArray(raw)
        ) {

            throw new Error(
                `${label} field '${field}' must be an array.`,
            );

        }

        return raw.map(
            (item, index) => {

                const path =
                    `${field}[${index}]`;

                this.assertObject(
                    item,
                    path,
                );

                return {

                    id:
                        this.requiredString(
                            item,
                            "id",
                            path,
                        ),

                    description:
                        this.requiredString(
                            item,
                            "description",
                            path,
                        ),

                } as T;

            },
        );

    }

    private assertObject(
        value: unknown,
        path: string,
    ): asserts value is Record<string, unknown> {

        if (
            typeof value !== "object" ||
            value === null ||
            Array.isArray(value)
        ) {

            throw new Error(
                `${path} must be an object.`,
            );

        }

    }

    private requiredString(
        value: Record<string, unknown>,
        field: string,
        path = "Requirements",
    ): string {

        const result =
            value[field];

        if (
            typeof result !== "string" ||
            !result.trim()
        ) {

            throw new Error(
                `${path}.${field} must be a non-empty string.`,
            );

        }

        return result;

    }

    private requiredEnum<T extends string>(
        value: Record<string, unknown>,
        field: string,
        allowed: readonly T[],
        path: string,
    ): T {

        const result =
            value[field];

        if (
            typeof result !== "string" ||
            !allowed.includes(
                result as T,
            )
        ) {

            throw new Error(
                `${path}.${field} must be one of: ${allowed.join(", ")}.`,
            );

        }

        return result as T;

    }

}
import {
    Artifact,
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    Requirements,
    Requirement,
} from "@engineering/shared/engineering";

import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
    EngineSpecification,
    EngineType,
} from "@engineering/shared/engine";

export class ValidateRequirementsEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.validate-requirements",

        displayName:
            "Validate Requirements",

        type:
            "VALIDATOR" as EngineType,

        metadata: {

            version:
                "1.0.0",

        },

    };

    async execute(

        context: EngineContext,

        request: EngineRequest,

    ): Promise<EngineResult> {

        const inputArtifact =
            request.input.artifacts[0];

        if (!inputArtifact) {

            throw new Error(
                "Validate Requirements requires an input artifact.",
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

        const requirements =
            this.validatePayload(
                inputArtifact.payload,
            );

        const artifact: Artifact = {

            id:
                `validated-requirements-${inputArtifact.id}`,

            name:
                "Validated Requirements",

            type:
                "VALIDATED_REQUIREMENTS",

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

    private validatePayload(
        payload: unknown,
    ): Requirements {

        if (
            typeof payload !== "object" ||
            payload === null ||
            Array.isArray(payload)
        ) {

            throw new Error(
                "Requirements payload must be an object.",
            );

        }

        const value =
            payload as Record<string, unknown>;

        this.requireString(
            value,
            "projectName",
        );

        this.requireString(
            value,
            "version",
        );

        const functional =
            this.requireRequirementArray(
                value.functionalRequirements,
                "functionalRequirements",
            );

        const nonFunctional =
            this.requireRequirementArray(
                value.nonFunctionalRequirements,
                "nonFunctionalRequirements",
            );

        const constraints =
            this.requireSimpleArray(
                value.constraints,
                "constraints",
            );

        const assumptions =
            this.requireSimpleArray(
                value.assumptions,
                "assumptions",
            );

        const allRequirements = [

            ...functional,

            ...nonFunctional,

        ];

        this.validateUniqueRequirementIds(
            allRequirements,
        );

        this.validateUniqueIds(
            constraints,
            "constraints",
        );

        this.validateUniqueIds(
            assumptions,
            "assumptions",
        );

        return {

            projectName:
                value.projectName as string,

            version:
                value.version as string,

            functionalRequirements:
                functional,

            nonFunctionalRequirements:
                nonFunctional,

            constraints,

            assumptions,

        };

    }

    private requireString(
        value: Record<string, unknown>,
        field: string,
    ): string {

        const result =
            value[field];

        if (
            typeof result !== "string" ||
            !result.trim()
        ) {

            throw new Error(
                `${field} must be a non-empty string.`,
            );

        }

        return result;

    }

    private requireRequirementArray(
        value: unknown,
        field: string,
    ): readonly Requirement[] {

        if (
            !Array.isArray(value)
        ) {

            throw new Error(
                `${field} must be an array.`,
            );

        }

        return value.map(
            (item, index) => {

                if (
                    typeof item !== "object" ||
                    item === null ||
                    Array.isArray(item)
                ) {

                    throw new Error(
                        `${field}[${index}] must be an object.`,
                    );

                }

                const requirement =
                    item as Requirement;

                if (
                    !requirement.id?.trim()
                ) {

                    throw new Error(
                        `${field}[${index}].id is required.`,
                    );

                }

                if (
                    !requirement.title?.trim()
                ) {

                    throw new Error(
                        `${field}[${index}].title is required.`,
                    );

                }

                if (
                    !requirement.description?.trim()
                ) {

                    throw new Error(
                        `${field}[${index}].description is required.`,
                    );

                }

                if (
                    !Array.isArray(
                        requirement.acceptanceCriteria,
                    ) ||
                    requirement.acceptanceCriteria.length === 0
                ) {

                    throw new Error(
                        `${field}[${index}] must contain acceptance criteria.`,
                    );

                }

                for (
                    const criterion
                    of requirement.acceptanceCriteria
                ) {

                    if (
                        !criterion.id?.trim() ||
                        !criterion.description?.trim()
                    ) {

                        throw new Error(
                            `${field}[${index}] contains an invalid acceptance criterion.`,
                        );

                    }

                }

                return requirement;

            },
        );

    }

    private requireSimpleArray(
        value: unknown,
        field: string,
    ): readonly {
        readonly id: string;
        readonly description: string;
    }[] {

        if (
            !Array.isArray(value)
        ) {

            throw new Error(
                `${field} must be an array.`,
            );

        }

        return value.map(
            (item, index) => {

                if (
                    typeof item !== "object" ||
                    item === null ||
                    Array.isArray(item)
                ) {

                    throw new Error(
                        `${field}[${index}] must be an object.`,
                    );

                }

                const entry =
                    item as {
                        readonly id?: unknown;
                        readonly description?: unknown;
                    };

                if (
                    typeof entry.id !== "string" ||
                    !entry.id.trim()
                ) {

                    throw new Error(
                        `${field}[${index}].id is required.`,
                    );

                }

                if (
                    typeof entry.description !== "string" ||
                    !entry.description.trim()
                ) {

                    throw new Error(
                        `${field}[${index}].description is required.`,
                    );

                }

                return {

                    id:
                        entry.id,

                    description:
                        entry.description,

                };

            },
        );

    }

    private validateUniqueRequirementIds(
        requirements: readonly Requirement[],
    ): void {

        this.validateUniqueIds(
            requirements,
            "requirements",
        );

    }

    private validateUniqueIds(
        values: readonly {
            readonly id: string;
        }[],
        label: string,
    ): void {

        const ids =
            new Set<string>();

        for (
            const value
            of values
        ) {

            if (
                ids.has(value.id)
            ) {

                throw new Error(
                    `Duplicate ${label} id '${value.id}'.`,
                );

            }

            ids.add(
                value.id,
            );

        }

    }

}
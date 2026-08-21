import {
    Artifact,
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    RequirementSet,
    Requirement,
    RequirementCandidate,
    RequirementProvenance,
} from "@engineering/shared/engineering";

import {
    RequirementType,
    RequirementPriority,
    RequirementStatus,
} from "@engineering/shared/engineering";

import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
    EngineSpecification,
    EngineType,
} from "@engineering/shared/engine";

import {
    PlatformError,
} from "@engineering/shared/foundation";

export class ValidateRequirementSetEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.validate-requirement-set",

        displayName:
            "Validate Requirement Set",

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

        console.log(
            "[REQUIREMENT-SET] validation:start",
        );

        const input =
            request.input.artifacts[0];

        if (!input) {

            throw new PlatformError(
                "REQUIREMENT_SET_INPUT_MISSING",
                "Requirement set validation requires an input artifact.",
                {
                    component:
                        "ValidateRequirementSetEngine",
                },
            );

        }

        if (
            input.type !==
            "REQUIREMENT_SET"
        ) {

            throw new PlatformError(
                "INVALID_REQUIREMENT_SET_ARTIFACT",
                `Expected REQUIREMENT_SET artifact but received '${input.type}'.`,
                {
                    component:
                        "ValidateRequirementSetEngine",

                    details: {
                        artifactId:
                            input.id,

                        artifactType:
                            input.type,
                    },
                },
            );

        }

        try {

            const requirementSet =
                this.validateRequirementSet(
                    input.payload,
                );

            const artifact: Artifact = {

                id:
                    `validated-requirement-set-${input.id}`,

                name:
                    "Validated Requirement Set",

                type:
                    "VALIDATED_REQUIREMENT_SET",

                version:
                    input.version + 1,

                state:
                    ArtifactState.CREATED,

                metadata: {

                    createdAt:
                        new Date(),

                },

                parents: [

                    {

                        id:
                            input.id,

                        version:
                            input.version,

                        type:
                            input.type,

                        name:
                            input.name,

                    },

                ],

                payload:
                    requirementSet,

            };

            console.log(
                "[REQUIREMENT-SET] validation:done",
                {
                    artifactId:
                        artifact.id,

                    functionalRequirements:
                        requirementSet.functionalRequirements.length,

                    nonFunctionalRequirements:
                        requirementSet.nonFunctionalRequirements.length,

                    candidates:
                        requirementSet.candidates.length,
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
                    : "Requirement set validation failed.";

            console.error(
                "[REQUIREMENT-SET] validation:failed",
                {
                    artifactId:
                        input.id,

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
                "REQUIREMENT_SET_VALIDATION_FAILED",
                message,
                {
                    component:
                        "ValidateRequirementSetEngine",

                    details: {
                        artifactId:
                            input.id,
                    },

                    cause:
                        error,
                },
            );

        }

    }

    private validateRequirementSet(
        payload: unknown,
    ): RequirementSet {

        this.assertObject(
            payload,
            "Requirement set",
        );

        this.requireString(
            payload,
            "projectName",
        );

        this.requireString(
            payload,
            "version",
        );

        const functionalRequirements =
            this.requireRequirementArray(
                payload.functionalRequirements,
                "functionalRequirements",
                RequirementType.FUNCTIONAL,
            );

        const nonFunctionalRequirements =
            this.requireRequirementArray(
                payload.nonFunctionalRequirements,
                "nonFunctionalRequirements",
                RequirementType.NON_FUNCTIONAL,
            );

        const candidates =
            this.requireCandidateArray(
                payload.candidates,
                "candidates",
            );

        const constraints =
            this.requireSimpleArray(
                payload.constraints,
                "constraints",
            );

        const assumptions =
            this.requireSimpleArray(
                payload.assumptions,
                "assumptions",
            );

        const requirements = [

            ...functionalRequirements,

            ...nonFunctionalRequirements,

        ];

        this.validateUniqueIds(
            requirements,
            "requirements",
        );

        this.validateUniqueIds(
            candidates,
            "requirement candidates",
        );

        this.validateUniqueIds(
            constraints,
            "constraints",
        );

        this.validateUniqueIds(
            assumptions,
            "assumptions",
        );

        this.validateCrossCollectionIds(
            requirements,
            candidates,
        );

        return {

            projectName:
                payload.projectName as string,

            version:
                payload.version as string,

            functionalRequirements,

            nonFunctionalRequirements,

            candidates,

            constraints,

            assumptions,

        };

    }

    private requireRequirementArray(
        value: unknown,
        field: string,
        expectedType: RequirementType,
    ): readonly Requirement[] {

        this.requireArray(
            value,
            field,
        );

        return (
            value as unknown[]
        ).map(
            (item, index) => {

                const path =
                    `${field}[${index}]`;

                this.assertObject(
                    item,
                    path,
                );

                this.requireString(
                    item,
                    "id",
                    path,
                );

                this.requireString(
                    item,
                    "title",
                    path,
                );

                this.requireString(
                    item,
                    "description",
                    path,
                );

                this.requireEnum(
                    item.type,
                    Object.values(
                        RequirementType,
                    ),
                    `${path}.type`,
                );

                if (
                    item.type !==
                    expectedType
                ) {

                    throw new Error(
                        `${path}.type must be ${expectedType}.`,
                    );

                }

                this.requireEnum(
                    item.priority,
                    Object.values(
                        RequirementPriority,
                    ),
                    `${path}.priority`,
                );

                this.requireEnum(
                    item.status,
                    Object.values(
                        RequirementStatus,
                    ),
                    `${path}.status`,
                );

                this.requireAcceptanceCriteria(
                    item.acceptanceCriteria,
                    `${path}.acceptanceCriteria`,
                );

                if (
                    item.provenance === undefined
                ) {

                    throw new Error(
                        `${path}.provenance is required.`,
                    );

                }

                this.validateProvenance(
                    item.provenance,
                    `${path}.provenance`,
                );

                return item as unknown as Requirement;

            },
        );

    }

    private requireCandidateArray(
        value: unknown,
        field: string,
    ): readonly RequirementCandidate[] {

        this.requireArray(
            value,
            field,
        );

        return (
            value as unknown[]
        ).map(
            (item, index) => {

                const path =
                    `${field}[${index}]`;

                this.assertObject(
                    item,
                    path,
                );

                this.requireString(
                    item,
                    "id",
                    path,
                );

                this.requireString(
                    item,
                    "title",
                    path,
                );

                this.requireString(
                    item,
                    "description",
                    path,
                );

                this.requireEnum(
                    item.type,
                    Object.values(
                        RequirementType,
                    ),
                    `${path}.type`,
                );

                this.requireEnum(
                    item.priority,
                    Object.values(
                        RequirementPriority,
                    ),
                    `${path}.priority`,
                );

                this.requireString(
                    item,
                    "rationale",
                    path,
                );

                this.requireEnum(
                    item.confidence,
                    [
                        "HIGH",
                        "MEDIUM",
                        "LOW",
                    ],
                    `${path}.confidence`,
                );

                if (
                    item.provenance === undefined
                ) {

                    throw new Error(
                        `${path}.provenance is required.`,
                    );

                }

                this.validateProvenance(
                    item.provenance,
                    `${path}.provenance`,
                );

                return item as unknown as RequirementCandidate;

            },
        );

    }

    private validateProvenance(
        value: unknown,
        field: string,
    ): asserts value is RequirementProvenance {

        this.assertObject(
            value,
            field,
        );

        this.requireString(
            value,
            "sourceType",
            field,
        );

        this.requireArray(
            value.sourceArtifactIds,
            `${field}.sourceArtifactIds`,
        );

        if (
            (
                value.sourceArtifactIds as unknown[]
            ).length === 0
        ) {

            throw new Error(
                `${field}.sourceArtifactIds must contain at least one artifact ID.`,
            );

        }

        for (
            const [index, sourceArtifactId]
            of (
                value.sourceArtifactIds as unknown[]
            ).entries()
        ) {

            if (
                typeof sourceArtifactId !== "string" ||
                !sourceArtifactId.trim()
            ) {

                throw new Error(
                    `${field}.sourceArtifactIds[${index}] must be a non-empty string.`,
                );

            }

        }

        if (
            value.rationale !== undefined &&
            (
                typeof value.rationale !== "string" ||
                !value.rationale.trim()
            )
        ) {

            throw new Error(
                `${field}.rationale must be a non-empty string when provided.`,
            );

        }

    }

    private requireAcceptanceCriteria(
        value: unknown,
        field: string,
    ): void {

        this.requireArray(
            value,
            field,
        );

        if (
            (
                value as unknown[]
            ).length === 0
        ) {

            throw new Error(
                `${field} must contain at least one acceptance criterion.`,
            );

        }

        const ids =
            new Set<string>();

        for (
            const [index, item]
            of (
                value as unknown[]
            ).entries()
        ) {

            const path =
                `${field}[${index}]`;

            this.assertObject(
                item,
                path,
            );

            this.requireString(
                item,
                "id",
                path,
            );

            this.requireString(
                item,
                "description",
                path,
            );

            const id =
                item.id as string;

            if (
                ids.has(id)
            ) {

                throw new Error(
                    `Duplicate acceptance criterion id '${id}' in ${field}.`,
                );

            }

            ids.add(
                id,
            );

        }

    }

    private requireSimpleArray(
        value: unknown,
        field: string,
    ): readonly {

        readonly id: string;

        readonly description: string;

    }[] {

        this.requireArray(
            value,
            field,
        );

        return (
            value as unknown[]
        ).map(
            (item, index) => {

                const path =
                    `${field}[${index}]`;

                this.assertObject(
                    item,
                    path,
                );

                this.requireString(
                    item,
                    "id",
                    path,
                );

                this.requireString(
                    item,
                    "description",
                    path,
                );

                return {

                    id:
                        item.id as string,

                    description:
                        item.description as string,

                };

            },
        );

    }

    private validateCrossCollectionIds(
        requirements: readonly Requirement[],
        candidates: readonly RequirementCandidate[],
    ): void {

        const requirementIds =
            new Set(
                requirements.map(
                    requirement =>
                        requirement.id,
                ),
            );

        for (
            const candidate
            of candidates
        ) {

            if (
                requirementIds.has(
                    candidate.id,
                )
            ) {

                throw new Error(
                    `Requirement candidate id '${candidate.id}' conflicts with a requirement id.`,
                );

            }

        }

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
                ids.has(
                    value.id,
                )
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

    private requireArray(
        value: unknown,
        field: string,
    ): asserts value is readonly unknown[] {

        if (
            !Array.isArray(value)
        ) {

            throw new Error(
                `${field} must be an array.`,
            );

        }

    }

    private requireString(
        value: Record<string, unknown>,
        field: string,
        prefix?: string,
    ): string {

        const result =
            value[field];

        const fieldName =
            prefix
                ? `${prefix}.${field}`
                : field;

        if (
            typeof result !== "string" ||
            !result.trim()
        ) {

            throw new Error(
                `${fieldName} must be a non-empty string.`,
            );

        }

        return result;

    }

    private requireEnum(
        value: unknown,
        allowedValues: readonly string[],
        field: string,
    ): void {

        if (
            typeof value !== "string" ||
            !allowedValues.includes(value)
        ) {

            throw new Error(
                `${field} must be one of: ${allowedValues.join(", ")}.`,
            );

        }

    }

    private assertObject(
        value: unknown,
        field: string,
    ): asserts value is Record<string, unknown> {

        if (
            typeof value !== "object" ||
            value === null ||
            Array.isArray(value)
        ) {

            throw new Error(
                `${field} must be an object.`,
            );

        }

    }

}
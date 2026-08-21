import {
    Artifact,
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    RequirementSet,
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

export class GenerateRequirementsDocumentEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.generate-requirements-document",

        displayName:
            "Generate Requirements Document",

        type:
            "EXPORTER" as EngineType,

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
                "Generate Requirements Document requires an input artifact.",
            );

        }

        if (
            inputArtifact.type !==
            "VALIDATED_REQUIREMENT_SET"
        ) {

            throw new Error(
                `Expected VALIDATED_REQUIREMENT_SET artifact but received '${inputArtifact.type}'.`,
            );

        }

        const requirementSet =
            this.requireRequirementSet(
                inputArtifact.payload,
            );

        const document =
            this.generateDocument(
                requirementSet,
            );

        const artifact: Artifact = {

            id:
                `requirements-document-${inputArtifact.id}`,

            name:
                "Requirements Document",

            type:
                "REQUIREMENTS_DOCUMENT",

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
                document,

        };

        return {

            output: {

                artifacts: [

                    artifact,

                ],

            },

        };

    }

    private requireRequirementSet(
        payload: unknown,
    ): RequirementSet {

        if (
            typeof payload !== "object" ||
            payload === null ||
            Array.isArray(payload)
        ) {

            throw new Error(
                "Validated requirement set payload must be an object.",
            );

        }

        const value =
            payload as Record<string, unknown>;

        if (
            typeof value.projectName !== "string" ||
            !value.projectName.trim()
        ) {

            throw new Error(
                "Requirement set projectName is required.",
            );

        }

        if (
            typeof value.version !== "string" ||
            !value.version.trim()
        ) {

            throw new Error(
                "Requirement set version is required.",
            );

        }

        if (
            !Array.isArray(
                value.functionalRequirements,
            )
        ) {

            throw new Error(
                "Requirement set functionalRequirements must be an array.",
            );

        }

        if (
            !Array.isArray(
                value.nonFunctionalRequirements,
            )
        ) {

            throw new Error(
                "Requirement set nonFunctionalRequirements must be an array.",
            );

        }

        if (
            !Array.isArray(
                value.candidates,
            )
        ) {

            throw new Error(
                "Requirement set candidates must be an array.",
            );

        }

        if (
            !Array.isArray(
                value.constraints,
            )
        ) {

            throw new Error(
                "Requirement set constraints must be an array.",
            );

        }

        if (
            !Array.isArray(
                value.assumptions,
            )
        ) {

            throw new Error(
                "Requirement set assumptions must be an array.",
            );

        }

        return value as unknown as RequirementSet;

    }

    private generateDocument(
        requirementSet: RequirementSet,
    ): string {

        const lines: string[] = [];

        lines.push(
            `# ${requirementSet.projectName}`,
        );

        lines.push("");

        lines.push(
            `**Requirements Version:** ${requirementSet.version}`,
        );

        lines.push("");

        lines.push(
            "## Functional Requirements",
        );

        lines.push("");

        this.appendRequirements(
            lines,
            requirementSet.functionalRequirements,
        );

        lines.push(
            "## Non-Functional Requirements",
        );

        lines.push("");

        this.appendRequirements(
            lines,
            requirementSet.nonFunctionalRequirements,
        );

        lines.push(
            "## Constraints",
        );

        lines.push("");

        if (
            requirementSet.constraints.length === 0
        ) {

            lines.push(
                "None.",
            );

        }
        else {

            for (
                const constraint
                of requirementSet.constraints
            ) {

                lines.push(
                    `- **${constraint.id}:** ${constraint.description}`,
                );

            }

        }

        lines.push("");

        lines.push(
            "## Assumptions",
        );

        lines.push("");

        if (
            requirementSet.assumptions.length === 0
        ) {

            lines.push(
                "None.",
            );

        }
        else {

            for (
                const assumption
                of requirementSet.assumptions
            ) {

                lines.push(
                    `- **${assumption.id}:** ${assumption.description}`,
                );

            }

        }

        lines.push("");

        lines.push(
            "## Requirement Candidates",
        );

        lines.push("");

        if (
            requirementSet.candidates.length === 0
        ) {

            lines.push(
                "None.",
            );

        }
        else {

            for (
                const candidate
                of requirementSet.candidates
            ) {

                lines.push(
                    `### ${candidate.id} — ${candidate.title}`,
                );

                lines.push("");

                lines.push(
                    candidate.description,
                );

                lines.push("");

                lines.push(
                    `- **Type:** ${candidate.type}`,
                );

                lines.push(
                    `- **Priority:** ${candidate.priority}`,
                );

                lines.push(
                    `- **Confidence:** ${candidate.confidence}`,
                );

                lines.push(
                    `- **Rationale:** ${candidate.rationale}`,
                );

                lines.push("");

            }

        }

        lines.push("");

        return lines.join("\n");

    }

    private appendRequirements(
        lines: string[],
        requirements: readonly Requirement[],
    ): void {

        if (
            requirements.length === 0
        ) {

            lines.push(
                "None.",
            );

            lines.push("");

            return;

        }

        for (
            const requirement
            of requirements
        ) {

            lines.push(
                `### ${requirement.id} — ${requirement.title}`,
            );

            lines.push("");

            lines.push(
                requirement.description,
            );

            lines.push("");

            lines.push(
                `- **Type:** ${requirement.type}`,
            );

            lines.push(
                `- **Priority:** ${requirement.priority}`,
            );

            lines.push(
                `- **Status:** ${requirement.status}`,
            );

            lines.push("");

            lines.push(
                "#### Acceptance Criteria",
            );

            lines.push("");

            for (
                const criterion
                of requirement.acceptanceCriteria
            ) {

                lines.push(
                    `- **${criterion.id}:** ${criterion.description}`,
                );

            }

            lines.push("");

        }

    }

}
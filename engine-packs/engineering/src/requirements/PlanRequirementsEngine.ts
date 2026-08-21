import {
    Artifact,
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    Plan,
} from "@engineering/shared/plan";

import {
    RequirementSet,
} from "@engineering/shared/engineering";

import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
    EngineSpecification,
    EngineType,
} from "@engineering/shared/engine";

export class PlanRequirementsEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.plan-requirements",

        displayName:
            "Plan Requirements",

        type:
            "PLANNER" as EngineType,

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
                "Plan Requirements requires an input artifact.",
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

        const steps = [

            {
                id:
                    "requirements-analysis",

                name:
                    "Analyze Requirements",

                objective:
                    "Analyze functional and non-functional requirements, constraints, assumptions, acceptance criteria, provenance, and supported requirement candidates.",
            },

            {
                id:
                    "requirements-design",

                name:
                    "Design Solution Structure",

                objective:
                    "Determine the logical implementation structure required to satisfy the validated requirements while respecting constraints and assumptions.",
            },

            {
                id:
                    "requirements-verification",

                name:
                    "Define Verification",

                objective:
                    "Define how the resulting implementation will be verified against the validated requirements and their acceptance criteria.",
            },

        ];

        const plan: Plan = {

            name:
                "requirements-engineering",

            version:
                requirementSet.version,

            objective:
                `Produce an implementation-ready plan for ${requirementSet.projectName}.`,

            inputs: [

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

            steps,

            dependencies: [

                {

                    step:
                        "requirements-design",

                    dependsOn:
                        "requirements-analysis",

                },

                {

                    step:
                        "requirements-verification",

                    dependsOn:
                        "requirements-design",

                },

            ],

            expectedArtifacts: [

                {

                    name:
                        "Requirements Analysis",

                    type:
                        "REQUIREMENTS_ANALYSIS",

                },

                {

                    name:
                        "Solution Structure",

                    type:
                        "SOLUTION_STRUCTURE",

                },

                {

                    name:
                        "Verification Plan",

                    type:
                        "VERIFICATION_PLAN",

                },

            ],

            constraints:
                requirementSet.constraints.map(
                    constraint =>
                        constraint.description,
                ),

        };

        const artifact: Artifact = {

            id:
                `requirements-plan-${inputArtifact.id}`,

            name:
                "Requirements Plan",

            type:
                "REQUIREMENTS_PLAN",

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
                plan,

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

}
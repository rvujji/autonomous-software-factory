import {
    Artifact,
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    Plan,
} from "@engineering/shared/plan";

import {
    Requirements,
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
            "VALIDATED_REQUIREMENTS"
        ) {

            throw new Error(
                `Expected VALIDATED_REQUIREMENTS artifact but received '${inputArtifact.type}'.`,
            );

        }

        const requirements =
            inputArtifact.payload as Requirements;

        const steps = [

            {
                id:
                    "requirements-analysis",

                name:
                    "Analyze Requirements",

                objective:
                    "Analyze functional and non-functional requirements, constraints, assumptions, and acceptance criteria.",
            },

            {
                id:
                    "requirements-design",

                name:
                    "Design Solution Structure",

                objective:
                    "Determine the logical implementation structure required to satisfy the validated requirements.",
            },

            {
                id:
                    "requirements-verification",

                name:
                    "Define Verification",

                objective:
                    "Define how the resulting implementation will be verified against the requirements and acceptance criteria.",
            },

        ];

        const plan: Plan = {

            name:
                "requirements-engineering",

            version:
                requirements.version,

            objective:
                `Produce an implementation-ready plan for ${requirements.projectName}.`,

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
                requirements.constraints.map(
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

}
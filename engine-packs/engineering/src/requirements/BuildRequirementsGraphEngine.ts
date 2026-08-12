import {
    Artifact,
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    Plan,
} from "@engineering/shared/plan";

import {
    Graph,
} from "@engineering/shared/graph";

import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
    EngineSpecification,
    EngineType,
} from "@engineering/shared/engine";

export class BuildRequirementsGraphEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name:
            "engineering.build-requirements-graph",

        displayName:
            "Build Requirements Graph",

        type:
            "TRANSFORMER" as EngineType,

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
                "Build Requirements Graph requires an input artifact.",
            );

        }

        if (
            inputArtifact.type !==
            "REQUIREMENTS_PLAN"
        ) {

            throw new Error(
                `Expected REQUIREMENTS_PLAN artifact but received '${inputArtifact.type}'.`,
            );

        }

        const plan =
            this.requirePlan(
                inputArtifact.payload,
            );

        const nodeIds =
            new Set<string>();

        const nodes =
            plan.steps.map(
                step => {

                    if (
                        nodeIds.has(
                            step.id,
                        )
                    ) {

                        throw new Error(
                            `Duplicate plan step id '${step.id}'.`,
                        );

                    }

                    nodeIds.add(
                        step.id,
                    );

                    return {

                        id:
                            step.id,

                        name:
                            step.name,

                        objective:
                            step.objective,

                    };

                },
            );

        const edges =
            plan.dependencies.map(
                dependency => {

                    if (
                        !nodeIds.has(
                            dependency.step,
                        )
                    ) {

                        throw new Error(
                            `Dependency references unknown step '${dependency.step}'.`,
                        );

                    }

                    if (
                        !nodeIds.has(
                            dependency.dependsOn,
                        )
                    ) {

                        throw new Error(
                            `Dependency references unknown step '${dependency.dependsOn}'.`,
                        );

                    }

                    if (
                        dependency.step ===
                        dependency.dependsOn
                    ) {

                        throw new Error(
                            `Step '${dependency.step}' cannot depend on itself.`,
                        );

                    }

                    return {

                        from:
                            dependency.dependsOn,

                        to:
                            dependency.step,

                    };

                },
            );

        const graph: Graph = {

            name:
                plan.name,

            version:
                plan.version,

            nodes,

            edges,

        };

        const artifact: Artifact = {

            id:
                `execution-graph-${inputArtifact.id}`,

            name:
                "Execution Graph",

            type:
                "EXECUTION_GRAPH",

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
                graph,

        };

        return {

            output: {

                artifacts: [

                    artifact,

                ],

            },

        };

    }

    private requirePlan(
        payload: unknown,
    ): Plan {

        if (
            typeof payload !== "object" ||
            payload === null ||
            Array.isArray(payload)
        ) {

            throw new Error(
                "Requirements plan payload must be an object.",
            );

        }

        const value =
            payload as Record<string, unknown>;

        if (
            typeof value.name !== "string" ||
            !value.name.trim()
        ) {

            throw new Error(
                "Requirements plan name is required.",
            );

        }

        if (
            typeof value.version !== "string" ||
            !value.version.trim()
        ) {

            throw new Error(
                "Requirements plan version is required.",
            );

        }

        if (
            typeof value.objective !== "string" ||
            !value.objective.trim()
        ) {

            throw new Error(
                "Requirements plan objective is required.",
            );

        }

        if (
            !Array.isArray(
                value.steps,
            )
        ) {

            throw new Error(
                "Requirements plan steps must be an array.",
            );

        }

        if (
            !Array.isArray(
                value.dependencies,
            )
        ) {

            throw new Error(
                "Requirements plan dependencies must be an array.",
            );

        }

        return value as unknown as Plan;

    }

}
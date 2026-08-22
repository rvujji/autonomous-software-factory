import {
    Artifact,
    ArtifactState,
} from "@engineering/shared/artifact";

import {
    WorkItem,
    WorkPlan,
} from "@engineering/shared/work";

import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
    EngineSpecification,
    EngineType,
} from "@engineering/shared/engine";

export class WorkDiscoveryEngine
implements Engine {

    readonly specification:
        EngineSpecification = {

        name:
            "engineering.discover-work",

        displayName:
            "Discover Project Work",

        type:
            "ANALYZER" as EngineType,

        metadata: {

            version:
                "1.0.0",

        },

    };

    async execute(

        context: EngineContext,

        request: EngineRequest,

    ): Promise<EngineResult> {

        const artifacts =
            request.input.artifacts;

        if (
            artifacts.length === 0
        ) {

            throw new Error(
                "Work discovery requires at least one input artifact.",
            );

        }

        const projectContext =
            artifacts
                .map(
                    artifact =>
                        this.serializeArtifact(
                            artifact,
                        ),
                )
                .join("\n\n---\n\n");

        const projectName =
            this.inferProjectName(
                artifacts,
            );

        const projectObjective =
            this.inferProjectObjective(
                artifacts,
            );

        const workItems =
            this.discoverWork(
                projectContext,
            );

        const plan: WorkPlan = {

            projectName,

            projectObjective,

            workItems,

        };

        const artifact: Artifact = {

            id:
                `work-plan-${artifacts[0]!.id}`,

            name:
                "Project Work Plan",

            type:
                "WORK_PLAN",

            version:
                1,

            state:
                ArtifactState.CREATED,

            metadata: {

                createdAt:
                    new Date(),

            },

            parents:
                artifacts.map(
                    source => ({

                        id:
                            source.id,

                        version:
                            source.version,

                        type:
                            source.type,

                        name:
                            source.name,

                    }),
                ),

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

    private discoverWork(
        context: string,
    ): WorkItem[] {

        const text =
            context.toLowerCase();

        const work: WorkItem[] = [];

        if (
            !text.includes("market research") &&
            !text.includes("market analysis")
        ) {

            work.push({

                id:
                    "market-research",

                name:
                    "Market Research",

                kind:
                    "RESEARCH",

                objective:
                    "Understand the relevant market, users, alternatives, and external context.",

                required:
                    true,

                dependsOn:
                    [],

            });

        }

        work.push({

            id:
                "product-definition",

            name:
                "Product Definition",

            kind:
                "PRODUCT_DEFINITION",

            objective:
                "Define the product problem, users, value proposition, and intended outcome.",

            required:
                true,

            dependsOn:
                ["market-research"],

        });

        work.push({

            id:
                "requirements",

            name:
                "Requirements",

            kind:
                "REQUIREMENTS",

            objective:
                "Produce validated requirements for the proposed solution.",

            required:
                true,

            dependsOn:
                ["product-definition"],

        });

        work.push({

            id:
                "architecture",

            name:
                "Architecture",

            kind:
                "ARCHITECTURE",

            objective:
                "Determine the solution structure required to satisfy the validated requirements.",

            required:
                true,

            dependsOn:
                ["requirements"],

        });

        return work;

    }

    private inferProjectName(
        artifacts: readonly Artifact[],
    ): string {

        const first =
            artifacts[0];

        if (
            first?.name?.trim()
        ) {

            return first.name.trim();

        }

        return "Unnamed Project";

    }

    private inferProjectObjective(
        artifacts: readonly Artifact[],
    ): string {

        const first =
            artifacts[0];

        if (
            typeof first?.payload === "string" &&
            first.payload.trim()
        ) {

            return first.payload.trim();

        }

        return "Determine and produce the required project artifacts.";

    }

    private serializeArtifact(
        artifact: Artifact,
    ): string {

        let payload: string;

        if (
            typeof artifact.payload === "string"
        ) {

            payload =
                artifact.payload;

        }
        else {

            try {

                payload =
                    JSON.stringify(
                        artifact.payload,
                        null,
                        2,
                    );

            }
            catch {

                payload =
                    String(
                        artifact.payload,
                    );

            }

        }

        return [

            `ARTIFACT: ${artifact.name}`,

            `TYPE: ${artifact.type}`,

            `ID: ${artifact.id}`,

            "CONTENT:",

            payload,

        ].join("\n");

    }

}
import {
    Artifact,
} from "@engineering/shared/artifact";

import {
    Pipeline,
    PipelineContext,
    PipelineRequest,
    PipelineResult,
    PipelineSpecification,
} from "@engineering/shared/pipeline";

import {
    EngineRuntime,
} from "@engineering/core/engine";

import {
    ArtifactRuntime,
} from "@engineering/core/artifact";

export class EngineeringPipeline
implements Pipeline {

    private static readonly MAX_REPAIR_ATTEMPTS = 2;

    readonly specification: PipelineSpecification = {

        name:
            "engineering.requirements",

        displayName:
            "Requirements Engineering",

        version:
            "1.0.0",

        type:
            "ENGINEERING" as PipelineSpecification["type"],

        metadata: {

            version:
                "1.0.0",

        },

        steps: [

            {

                engine:
                    "engineering.parse-requirements",

            },

            {

                engine:
                    "engineering.validate-requirements",

            },

            {

                engine:
                    "engineering.plan-requirements",

            },

        ],

    };

    constructor(

        private readonly engines:
            EngineRuntime,

        private readonly artifacts:
            ArtifactRuntime,

    ) {}

    async execute(

        context: PipelineContext,

        request: PipelineRequest,

    ): Promise<PipelineResult> {

        let artifacts =
            request.artifacts;
        let validatedRequirementsArtifact: Artifact | undefined;

        //
        // Parse
        //
        console.log("[PIPELINE] parse:start");
        const parseResult =
            await this.engines.execute(

                "engineering.parse-requirements",

                context,

                {

                    input: {

                        artifacts,

                    },

                },

            );
        console.log("[PIPELINE] parse:done");
        artifacts =
            await this.persistArtifacts(
                parseResult.output.artifacts ?? [],
            );
            
        //
        // Review → Repair → Review
        //
        
        for (
            let attempt = 0;
            attempt <= EngineeringPipeline.MAX_REPAIR_ATTEMPTS;
            attempt++
        ) {
            console.log(`[PIPELINE] validate:start attempt=${attempt + 1}`,);
            try {

                const validationResult =
                    await this.engines.execute(

                        "engineering.validate-requirements",

                        context,

                        {

                            input: {

                                artifacts,

                            },

                        },

                    );
                    console.log(`[PIPELINE] validate:done attempt=${attempt + 1}`,);
                    artifacts =
                        await this.persistArtifacts(
                            validationResult.output.artifacts ?? [],
                        );
                    validatedRequirementsArtifact = artifacts[0];

                    break;

            }
            catch (error) {

                if (
                    attempt >=
                    EngineeringPipeline.MAX_REPAIR_ATTEMPTS
                ) {

                    throw error;

                }
                
                const validationError =
                    error instanceof Error
                        ? error.message
                        : String(error);
                console.log(`[PIPELINE] repair:start attempt=${attempt + 1}`,);
                const repairResult =
                    await this.engines.execute(

                        "engineering.repair-requirements",

                        context,

                        {

                            input: {

                                artifacts,

                            },

                            configuration: {

                                validationError,

                            },

                        },

                    );
                console.log(`[PIPELINE] repair:done attempt=${attempt + 1}`,);
                artifacts =
                    await this.persistArtifacts(
                        repairResult.output.artifacts ?? [],
                    );

            }

        }
        console.log("[PIPELINE] plan:start");
        const planResult =
            await this.engines.execute(

                "engineering.plan-requirements",

                context,

                {

                    input: {

                        artifacts,

                    },

                },

            );
        console.log("[PIPELINE] plan:done");
        artifacts =
            await this.persistArtifacts(
                planResult.output.artifacts ?? [],
            );
        console.log("[PIPELINE] graph:start",);
        const graphResult =
            await this.engines.execute(

                "engineering.build-requirements-graph",

                context,

                {

                    input: {

                        artifacts,

                    },

                },

            );
        console.log("[PIPELINE] graph:done",);
        artifacts =
            await this.persistArtifacts(
                graphResult.output.artifacts ?? [],
            );
        console.log("[PIPELINE] document:start");

        const documentResult =
            await this.engines.execute(

                "engineering.generate-requirements-document",

                context,

                {

                    input: {

                        artifacts: [

                            validatedRequirementsArtifact!,

                        ],

                    },

                },

            );

        console.log("[PIPELINE] document:done");

        artifacts =
            await this.persistArtifacts(
                documentResult.output.artifacts ?? [],
            );

        return {

            artifacts,

        };

    }

    private async persistArtifacts(
        artifacts: readonly Artifact[],
    ): Promise<readonly Artifact[]> {

        const persisted: Artifact[] = [];

        for (
            const artifact
            of artifacts
        ) {

            const created =
                await this.artifacts.create({

                    name:
                        artifact.name,

                    type:
                        artifact.type,

                    payload:
                        artifact.payload,

                    metadata:
                        artifact.metadata,

                    parents:
                        artifact.parents,

                });

            persisted.push(
                created,
            );

        }

        return persisted;

    }

}
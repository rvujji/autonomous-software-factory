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

export class RequirementsRefinementPipeline
implements Pipeline {

    readonly specification: PipelineSpecification = {

        name:
            "engineering.requirements-refinement",

        displayName:
            "Requirements Refinement",

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
                    "engineering.extract-knowledge",
            },

            {
                engine:
                    "engineering.synthesize-knowledge",
            },

            {
                engine:
                    "engineering.refine-requirements",
            },

            {
                engine:
                    "engineering.validate-requirement-set",
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

        if (
            request.artifacts.length === 0
        ) {

            throw new Error(
                "Requirements refinement requires at least one source artifact.",
            );

        }

        let artifacts =
            request.artifacts;

        console.log(
            "[REFINEMENT] knowledge:extract:start",
        );

        const findingsResult =
            await this.engines.execute(

                "engineering.extract-knowledge",

                context,

                {

                    input: {

                        artifacts,

                    },

                },

            );

        artifacts =
            await this.persistArtifacts(
                findingsResult.output.artifacts ?? [],
            );

        console.log(
            "[REFINEMENT] knowledge:extract:done",
        );

        console.log(
            "[REFINEMENT] knowledge:synthesize:start",
        );

        const synthesisResult =
            await this.engines.execute(

                "engineering.synthesize-knowledge",

                context,

                {

                    input: {

                        artifacts,

                    },

                },

            );

        const synthesisArtifacts =
            await this.persistArtifacts(
                synthesisResult.output.artifacts ?? [],
            );

        artifacts = [

            ...artifacts,

            ...synthesisArtifacts,

        ];

        console.log(
            "[REFINEMENT] knowledge:synthesize:done",
        );

        console.log(
            "[REFINEMENT] requirements:refine:start",
        );

        const refinementResult =
            await this.engines.execute(

                "engineering.refine-requirements",

                context,

                {

                    input: {

                        artifacts: [

                            ...request.artifacts,

                            ...artifacts,

                        ],

                    },

                },

            );

        const requirementArtifacts =
            await this.persistArtifacts(
                refinementResult.output.artifacts ?? [],
            );

        artifacts = [

            ...artifacts,

            ...requirementArtifacts,

        ];

        console.log(
            "[REFINEMENT] requirements:refine:done",
        );

        console.log(
            "[REFINEMENT] requirements:validate:start",
        );

        const validationResult =
            await this.engines.execute(

                "engineering.validate-requirement-set",

                context,

                {

                    input: {

                        artifacts:
                            requirementArtifacts,

                    },

                },

            );

        const validatedArtifacts =
            await this.persistArtifacts(
                validationResult.output.artifacts ?? [],
            );

        artifacts = [

            ...artifacts,

            ...validatedArtifacts,

        ];

        console.log(
            "[REFINEMENT] requirements:validate:done",
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
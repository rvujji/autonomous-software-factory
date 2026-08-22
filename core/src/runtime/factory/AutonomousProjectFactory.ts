import {
    Artifact,
} from "@engineering/shared/artifact";

import {
    FactoryRequest,
    FactoryResult,
} from "@engineering/shared/factory";

import {
    PipelineContext,
} from "@engineering/shared/pipeline";

import {
    PlatformError,
} from "@engineering/shared/foundation";

import {
    EngineRuntime,
} from "../engine/EngineRuntime.js";

import {
    ArtifactRuntime,
} from "../artifact/ArtifactRuntime.js";

import {
    PipelineRuntime,
} from "../pipeline/PipelineRuntime.js";

export interface AutonomousProjectFactoryOptions {

    readonly logger?: {

        debug?(
            message: string,
            metadata?: Record<string, unknown>,
        ): void;

        info?(
            message: string,
            metadata?: Record<string, unknown>,
        ): void;

        error?(
            message: string,
            metadata?: Record<string, unknown>,
        ): void;

    };

}

interface WorkItem {

    readonly id: string;

    readonly name: string;

    readonly kind: string;

    readonly objective: string;

    readonly required: boolean;

    readonly dependsOn: readonly string[];

}

interface WorkPlan {

    readonly projectName: string;

    readonly projectObjective: string;

    readonly workItems: readonly WorkItem[];

}

export class AutonomousProjectFactory {

    constructor(

        private readonly engines:
            EngineRuntime,

        private readonly artifacts:
            ArtifactRuntime,

        private readonly pipelines:
            PipelineRuntime,

        private readonly options:
            AutonomousProjectFactoryOptions = {},

    ) {}

    async execute(

        context: PipelineContext,

        request: FactoryRequest,

    ): Promise<FactoryResult> {

        this.options.logger?.info?.(
            "[FACTORY] execution started",
            {
                kind:
                    request.kind,
            },
        );

        const intakeArtifact =
            await this.createIntakeArtifact(
                request,
            );

        this.options.logger?.info?.(
            "[FACTORY] intake complete",
            {
                kind:
                    request.kind,

                artifactId:
                    intakeArtifact.id,
            },
        );

        const discoveryResult =
            await this.engines.execute(

                "engineering.discover-work",

                context,

                {

                    input: {

                        artifacts: [

                            intakeArtifact,

                        ],

                    },

                },

            );

        const discoveredArtifacts =
            await this.persistArtifacts(
                discoveryResult.output.artifacts ?? [],
            );

        this.options.logger?.info?.(
            "[FACTORY] work discovery complete",
            {
                artifactCount:
                    discoveredArtifacts.length,
            },
        );

        const workPlanArtifact =
            discoveredArtifacts.find(
                artifact =>
                    artifact.type ===
                    "WORK_PLAN",
            );

        if (!workPlanArtifact) {

            throw new PlatformError(
                "FACTORY_WORK_PLAN_MISSING",
                "Work discovery did not produce a WORK_PLAN artifact.",
                {
                    component:
                        "AutonomousProjectFactory",
                },
            );

        }

        const workPlan =
            this.requireWorkPlan(
                workPlanArtifact.payload,
            );

        const executionArtifacts: Artifact[] = [

            intakeArtifact,

            ...discoveredArtifacts,

        ];

        for (
            const workItem
            of workPlan.workItems
        ) {

            const pipelineName =
                this.resolvePipeline(
                    workItem,
                );

            if (!pipelineName) {

                this.options.logger?.debug?.(
                    "[FACTORY] no pipeline registered for work item",
                    {
                        workItem:
                            workItem.id,

                        kind:
                            workItem.kind,
                    },
                );

                continue;

            }

            this.options.logger?.info?.(
                "[FACTORY] pipeline:start",
                {
                    workItem:
                        workItem.id,

                    pipeline:
                        pipelineName,
                },
            );

            const pipelineResult =
                await this.pipelines.execute(

                    pipelineName,

                    context,

                    {

                        artifacts:
                            executionArtifacts,

                    },

                );

            executionArtifacts.push(
                ...pipelineResult.artifacts,
            );

            this.options.logger?.info?.(
                "[FACTORY] pipeline:done",
                {
                    workItem:
                        workItem.id,

                    pipeline:
                        pipelineName,

                    artifactCount:
                        pipelineResult.artifacts.length,
                },
            );

        }

        return {

            artifacts:
                executionArtifacts,

        };

    }

    private resolvePipeline(
        workItem: WorkItem,
    ): string | undefined {

        switch (
            workItem.kind
        ) {

            case "REQUIREMENTS":

                return "engineering.requirements-refinement";

            case "REQUIREMENTS_REFINEMENT":

                return "engineering.requirements-refinement";

            default:

                return undefined;

        }

    }

    private requireWorkPlan(
        payload: unknown,
    ): WorkPlan {

        if (
            typeof payload !== "object" ||
            payload === null ||
            Array.isArray(payload)
        ) {

            throw new PlatformError(
                "FACTORY_INVALID_WORK_PLAN",
                "Work plan payload must be an object.",
                {
                    component:
                        "AutonomousProjectFactory",
                },
            );

        }

        const value =
            payload as Record<string, unknown>;

        if (
            typeof value.projectName !==
                "string" ||
            !value.projectName.trim()
        ) {

            throw new PlatformError(
                "FACTORY_INVALID_WORK_PLAN",
                "Work plan projectName is required.",
                {
                    component:
                        "AutonomousProjectFactory",
                },
            );

        }

        if (
            typeof value.projectObjective !==
                "string"
        ) {

            throw new PlatformError(
                "FACTORY_INVALID_WORK_PLAN",
                "Work plan projectObjective is required.",
                {
                    component:
                        "AutonomousProjectFactory",
                },
            );

        }

        if (
            !Array.isArray(
                value.workItems,
            )
        ) {

            throw new PlatformError(
                "FACTORY_INVALID_WORK_PLAN",
                "Work plan workItems must be an array.",
                {
                    component:
                        "AutonomousProjectFactory",
                },
            );

        }

        return value as unknown as WorkPlan;

    }

    private async createIntakeArtifact(
        request: FactoryRequest,
    ): Promise<Artifact> {

        if (
            request.kind === "PROJECT"
        ) {

            if (
                request.artifacts.length === 0
            ) {

                throw new PlatformError(
                    "FACTORY_PROJECT_INPUT_EMPTY",
                    "Project input requires at least one artifact.",
                    {
                        component:
                            "AutonomousProjectFactory",
                    },
                );

            }

            return this.artifacts.create({

                name:
                    "Project Intake",

                type:
                    "PROJECT_INTAKE",

                payload: {

                    kind:
                        "PROJECT",

                    artifacts:
                        request.artifacts,

                },

                parents:
                    request.artifacts.map(
                        artifact => ({

                            id:
                                artifact.id,

                            version:
                                artifact.version,

                            type:
                                artifact.type,

                            name:
                                artifact.name,

                        }),
                    ),

            });

        }

        if (
            request.kind === "TOPIC"
        ) {

            const topic =
                request.topic.trim();

            if (!topic) {

                throw new PlatformError(
                    "FACTORY_TOPIC_EMPTY",
                    "Topic input requires a non-empty topic.",
                    {
                        component:
                            "AutonomousProjectFactory",
                    },
                );

            }

            return this.artifacts.create({

                name:
                    "Topic Intake",

                type:
                    "TOPIC_INTAKE",

                payload: {

                    kind:
                        "TOPIC",

                    topic,

                },

                parents: [],

            });

        }

        throw new PlatformError(
            "FACTORY_INPUT_INVALID",
            "Unsupported factory input.",
            {
                component:
                    "AutonomousProjectFactory",
            },
        );

    }

    private async persistArtifacts(
        artifacts:
            readonly Artifact[],
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
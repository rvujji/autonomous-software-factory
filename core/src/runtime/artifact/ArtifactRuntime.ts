import {
    Artifact,
    ArtifactState,
    ArtifactStore,
    CreateArtifactRequest,
} from "@engineering/shared/artifact";

import {
    Identifier,
    Logger,
    PlatformError,
} from "@engineering/shared/foundation";

import { Clock } from "../foundation/Clock.js";
import { IdentifierGenerator } from "../foundation/IdentifierGenerator.js";

export class ArtifactRuntime {

    constructor(

        private readonly store:
            ArtifactStore,

        private readonly identifierGenerator:
            IdentifierGenerator,

        private readonly clock:
            Clock,

        private readonly logger?:
            Logger,

    ) {}

    async create(
        request: CreateArtifactRequest,
    ): Promise<Artifact> {

        this.logger?.debug(
            "Artifact creation started.",
            {
                name:
                    request.name,

                type:
                    request.type,
            },
        );

        try {

            if (
                !request.name.trim()
            ) {

                throw new PlatformError(
                    "ARTIFACT_NAME_REQUIRED",
                    "Artifact name is required.",
                    {
                        component:
                            "ArtifactRuntime",
                    },
                );

            }

            if (
                !request.type.trim()
            ) {

                throw new PlatformError(
                    "ARTIFACT_TYPE_REQUIRED",
                    "Artifact type is required.",
                    {
                        component:
                            "ArtifactRuntime",
                    },
                );

            }

            const artifact: Artifact =
                Object.freeze({

                    id:
                        await this.identifierGenerator.generate(),

                    name:
                        request.name,

                    type:
                        request.type,

                    version:
                        1,

                    state:
                        ArtifactState.CREATED,

                    metadata: {

                        createdAt:
                            this.clock.now(),

                        ...request.metadata,

                    },

                    parents:
                        request.parents ?? [],

                    payload:
                        request.payload,

                });

            await this.store.store(
                artifact,
            );

            this.logger?.debug(
                "Artifact created.",
                {
                    artifactId:
                        artifact.id,

                    name:
                        artifact.name,

                    type:
                        artifact.type,
                },
            );

            return artifact;

        }
        catch (error) {

            const platformError =
                error instanceof PlatformError
                    ? error
                    : new PlatformError(
                        "ARTIFACT_CREATION_FAILED",
                        `Artifact '${request.name}' could not be created.`,
                        {
                            component:
                                "ArtifactRuntime",

                            details: {
                                name:
                                    request.name,

                                type:
                                    request.type,
                            },

                            cause:
                                error,
                        },
                    );

            this.logger?.error(
                "Artifact creation failed.",
                {
                    name:
                        request.name,

                    type:
                        request.type,

                    code:
                        platformError.code,

                    error:
                        platformError.message,
                },
            );

            throw platformError;

        }

    }

    async get(
        id: Identifier,
    ): Promise<Artifact | undefined> {

        return this.store.get(
            id,
        );

    }

    async exists(
        id: Identifier,
    ): Promise<boolean> {

        return this.store.exists(
            id,
        );

    }

}
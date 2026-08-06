import {
    Artifact,
    ArtifactState,
    ArtifactStore,
    CreateArtifactRequest
} from "@engineering/shared/artifact";

import {
    Identifier
} from "@engineering/shared/foundation";

import { Clock } from "../foundation/Clock.js";
import { IdentifierGenerator } from "../foundation/IdentifierGenerator.js";

export class ArtifactRuntime {

    constructor(
        private readonly store: ArtifactStore,
        private readonly identifierGenerator: IdentifierGenerator,
        private readonly clock: Clock
    ) {}

    async create(
        request: CreateArtifactRequest
    ): Promise<Artifact> {

        if (!request.name.trim()) {
            throw new Error("Artifact name is required.");
        }

        if (!request.type.trim()) {
            throw new Error("Artifact type is required.");
        }

        const artifact: Artifact = Object.freeze({

            id: await this.identifierGenerator.generate(),

            name: request.name,

            type: request.type,

            version: 1,

            state: ArtifactState.CREATED,

            metadata: {
                createdAt: this.clock.now(),
                ...request.metadata
            },

            parents: request.parents ?? [],

            payload: request.payload

        });

        await this.store.store(artifact);

        return artifact;

    }

    async get(
        id: Identifier
    ): Promise<Artifact | undefined> {

        return this.store.get(id);

    }

    async exists(
        id: Identifier
    ): Promise<boolean> {

        return this.store.exists(id);

    }

}
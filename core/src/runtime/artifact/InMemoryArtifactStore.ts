import {
    Artifact,
    ArtifactQuery,
    ArtifactSort,
    ArtifactFilter,
    ArtifactStore,
} from "../../../../shared/src/artifact/index.js";

import {
    Identifier,
} from "../../../../shared/src/foundation/index.js";

/**
 * Simple in-memory implementation of ArtifactStore.
 *
 * Intended for unit tests and early runtime development.
 */
export class InMemoryArtifactStore implements ArtifactStore {

    private readonly artifacts = new Map<Identifier, Artifact>();

    async store(
        artifact: Artifact,
    ): Promise<void> {

        if (this.artifacts.has(artifact.id)) {
            throw new Error(
                `Artifact '${artifact.id}' already exists.`,
            );
        }

        this.artifacts.set(
            artifact.id,
            artifact,
        );
    }

    async get(
        id: Identifier,
    ): Promise<Artifact | undefined> {

        return this.artifacts.get(id);

    }

    async exists(
        id: Identifier,
    ): Promise<boolean> {

        return this.artifacts.has(id);

    }

    async find(
        query?: ArtifactQuery,
        filter?: ArtifactFilter,
        sort?: ArtifactSort,
    ): Promise<readonly Artifact[]> {

        let artifacts = [...this.artifacts.values()];

        // Query

        if (query?.id) {
            artifacts = artifacts.filter(
                (a) => a.id === query.id,
            );
        }

        if (query?.name) {
            artifacts = artifacts.filter(
                (a) => a.name === query.name,
            );
        }

        if (query?.type) {
            artifacts = artifacts.filter(
                (a) => a.type === query.type,
            );
        }

        if (query?.version !== undefined) {
            artifacts = artifacts.filter(
                (a) => a.version === query.version,
            );
        }

        if (query?.state) {
            artifacts = artifacts.filter(
                (a) => a.state === query.state,
            );
        }

        // Filter

        if (filter?.createdBy) {
            artifacts = artifacts.filter(
                (a) => a.metadata.createdBy === filter.createdBy,
            );
        }

        const createdAfter = filter?.createdAfter;

        if (createdAfter) {
            artifacts = artifacts.filter(
                artifact => artifact.metadata.createdAt >= createdAfter
            );
        }

        const createdBefore = filter?.createdBefore;

        if (createdBefore) {
            artifacts = artifacts.filter(
                artifact => artifact.metadata.createdAt <= createdBefore
            );
        }

        const labels = filter?.labels;

        if (labels) {

            artifacts = artifacts.filter((artifact) => {

                const artifactLabels = artifact.metadata.labels;

                if (!artifactLabels) {
                    return false;
                }

                return Object.entries(labels).every(
                    ([key, value]) => artifactLabels[key] === value
                );

            });

        }

        // Sort

        if (sort) {

            artifacts.sort((left, right) => {

                const direction =
                    sort.direction === "ASC" ? 1 : -1;

                switch (sort.field) {

                    case "name":
                        return (
                            left.name.localeCompare(right.name)
                            * direction
                        );

                    case "type":
                        return (
                            left.type.localeCompare(right.type)
                            * direction
                        );

                    case "version":
                        return (
                            (left.version - right.version)
                            * direction
                        );

                    case "createdAt":
                        return (
                            (
                                left.metadata.createdAt.getTime()
                                - right.metadata.createdAt.getTime()
                            )
                            * direction
                        );

                    default:
                        return 0;

                }

            });

        }

        return artifacts;

    }

    async archive(
        id: Identifier,
    ): Promise<void> {

        throw new Error(
            "archive() is not implemented. Artifact versioning will be handled by ArtifactRuntime.",
        );

    }

}
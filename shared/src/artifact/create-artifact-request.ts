import { ArtifactMetadata } from "./artifact-metadata.js";
import { ArtifactReference } from "./artifact-reference.js";
import { ArtifactType } from "./artifact-type.js";

/**
 * Request used to create a new Artifact.
 *
 * Runtime-managed properties such as identifier,
 * version and lifecycle state are intentionally omitted.
 */
export interface CreateArtifactRequest {

    /**
     * Human-readable artifact name.
     */
    readonly name: string;

    /**
     * Artifact classification.
     */
    readonly type: ArtifactType;

    /**
     * Artifact content.
     */
    readonly payload: unknown;

    /**
     * Optional artifact metadata.
     */
    readonly metadata?: ArtifactMetadata;

    /**
     * Parent artifacts used to derive this artifact.
     */
    readonly parents?: readonly ArtifactReference[];
}
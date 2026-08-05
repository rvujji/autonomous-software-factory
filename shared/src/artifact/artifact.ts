import { Metadata } from "../foundation/metadata.js";
import { Reference } from "../foundation/reference.js";
import { State } from "../foundation/state.js";
import { Identifier } from "../foundation/identifier.js";
import { Version } from "../foundation/version.js";
import { ArtifactType } from "./artifact-type.js";
import { ArtifactState } from "./artifact-state.js";
import { ArtifactReference } from "./artifact-reference.js";
import { ArtifactMetadata } from "./artifact-metadata.js";

/**
 * Represents an immutable engineering artifact.
 *
 * Every artifact produced by the Engineering Platform
 * (specifications, reviews, findings, prompts, code,
 * documents, etc.) is represented using this contract.
 */
export interface Artifact {

    /**
     * Globally unique artifact identifier.
     */
    readonly id: Identifier;

    readonly name: string;

    /**
     * Artifact classification.
     *
     * Examples:
     *  - specification
     *  - review
     *  - finding
     *  - source-code
     *  - prompt
     */
    readonly type: ArtifactType;

    /**
     * Immutable artifact version.
     */
    readonly version: Version;

    /**
     * Current lifecycle state.
     */
    readonly state: ArtifactState;

    /**
     * Artifact metadata.
     */
    readonly metadata: ArtifactMetadata;

    /**
     * Parent artifacts used to produce this artifact.
     */
    readonly parents: readonly ArtifactReference[];

    /**
     * Opaque artifact payload.
     *
     * The Engineering Core never interprets this value.
     */
    readonly payload: unknown;
}
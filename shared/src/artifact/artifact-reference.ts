import { Reference } from "../foundation/reference.js";
import { ArtifactType } from "./artifact-type.js";

/**
 * Reference to another Artifact.
 */
export interface ArtifactReference extends Reference {

    readonly type: ArtifactType;

    readonly name?: string;
}
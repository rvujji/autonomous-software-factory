import { Identifier } from "../foundation/identifier.js";
import { Version } from "../foundation/version.js";
import { ArtifactType } from "./artifact-type.js";
import { ArtifactState } from "./artifact-state.js";

export interface ArtifactQuery {

    readonly id?: Identifier;

    readonly name?: string;

    readonly type?: ArtifactType;

    readonly version?: Version;

    readonly state?: ArtifactState;
}
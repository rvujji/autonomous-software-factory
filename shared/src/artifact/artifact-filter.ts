import { Identifier } from "../foundation/identifier.js";
import { Timestamp } from "../foundation/timestamp.js";

export interface ArtifactFilter {

    readonly createdBy?: Identifier;

    readonly createdAfter?: Timestamp;

    readonly createdBefore?: Timestamp;

    readonly labels?: Readonly<Record<string, string>>;
}
import { Identifier } from "./identifier.js";
import { Timestamp } from "./timestamp.js";

export interface Metadata {

    readonly createdAt: Timestamp;

    readonly createdBy?: Identifier;

    readonly updatedAt?: Timestamp;

    readonly updatedBy?: Identifier;

    readonly labels?: Readonly<Record<string, string>>;
}
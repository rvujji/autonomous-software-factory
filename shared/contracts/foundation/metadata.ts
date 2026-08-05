import { Identifier } from "./identifier";
import { Timestamp } from "./timestamp";

export interface Metadata {

    readonly createdAt: Timestamp;

    readonly createdBy?: Identifier;

    readonly updatedAt?: Timestamp;

    readonly updatedBy?: Identifier;

    readonly labels?: Readonly<Record<string, string>>;
}
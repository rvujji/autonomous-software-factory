import { Identifier } from "./identifier";
import { Version } from "./version";

export interface Reference {

    readonly id: Identifier;

    readonly version?: Version;
}
import { Identifier } from "./identifier.js";
import { Version } from "./version.js";

export interface Reference {

    readonly id: Identifier;

    readonly version?: Version;
}
import { Timestamp } from "../foundation/timestamp.js";

export interface EngineMetadata {

    readonly author?: string;

    readonly version: string;

    readonly description?: string;

    readonly tags?: readonly string[];

    readonly createdAt?: Timestamp;

}
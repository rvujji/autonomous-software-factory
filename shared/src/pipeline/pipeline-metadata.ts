import { Timestamp } from "../foundation/timestamp.js";

export interface PipelineMetadata {

    readonly author?: string;

    readonly version: string;

    readonly description?: string;

    readonly tags?: readonly string[];

    readonly createdAt?: Timestamp;

}
import { Timestamp } from "../foundation/timestamp.js";

export interface ExecutionMetadata {

    readonly startedAt: Timestamp;

    readonly completedAt?: Timestamp;

    readonly durationMs?: number;

}
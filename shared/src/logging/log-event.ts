import {
    Timestamp,
} from "../foundation/timestamp.js";

export type LogLevel =
    | "DEBUG"
    | "INFO"
    | "WARN"
    | "ERROR";

export interface LogEvent {

    readonly timestamp: Timestamp;

    readonly level: LogLevel;

    readonly component: string;

    readonly message: string;

    readonly data?: unknown;

}
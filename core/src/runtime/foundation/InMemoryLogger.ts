import {
    Logger,
} from "@engineering/shared/foundation";

export interface LogRecord {

    readonly level:
        | "DEBUG"
        | "INFO"
        | "WARN"
        | "ERROR";

    readonly message:
        string;

    readonly data?:
        unknown;

}

export class InMemoryLogger
implements Logger {

    readonly records:
        LogRecord[] = [];

    debug(
        message: string,
        data?: unknown,
    ): void {

        this.records.push({
            level: "DEBUG",
            message,
            data,
        });

    }

    info(
        message: string,
        data?: unknown,
    ): void {

        this.records.push({
            level: "INFO",
            message,
            data,
        });

    }

    warn(
        message: string,
        data?: unknown,
    ): void {

        this.records.push({
            level: "WARN",
            message,
            data,
        });

    }

    error(
        message: string,
        data?: unknown,
    ): void {

        this.records.push({
            level: "ERROR",
            message,
            data,
        });

    }

}
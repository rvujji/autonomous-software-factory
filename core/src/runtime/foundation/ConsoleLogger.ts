import {
    Logger,
} from "@engineering/shared/foundation";

export class ConsoleLogger
implements Logger {

    debug(
        message: string,
        data?: unknown,
    ): void {

        console.debug(
            message,
            data,
        );

    }

    info(
        message: string,
        data?: unknown,
    ): void {

        console.info(
            message,
            data,
        );

    }

    warn(
        message: string,
        data?: unknown,
    ): void {

        console.warn(
            message,
            data,
        );

    }

    error(
        message: string,
        data?: unknown,
    ): void {

        console.error(
            message,
            data,
        );

    }

}
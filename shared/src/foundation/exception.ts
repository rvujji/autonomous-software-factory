import {
    ErrorInfo,
} from "./error.js";

export class PlatformError
extends Error {

    readonly code: string;

    readonly details?: unknown;

    readonly component: string | undefined;

    constructor(

        code: string,

        message: string,

        options?: {

            readonly details?: unknown;

            readonly component?: string;

            readonly cause?: unknown;

        },

    ) {

        super(
            message,
            {
                cause:
                    options?.cause,
            },
        );

        this.name =
            "PlatformError";

        this.code =
            code;

        this.details =
            options?.details;

        this.component =
            options?.component;

    }

    toErrorInfo(): ErrorInfo {

        return {

            code:
                this.code,

            message:
                this.message,

            ...(this.details !== undefined && {

                details:
                    this.details,

            }),

        };

    }

}
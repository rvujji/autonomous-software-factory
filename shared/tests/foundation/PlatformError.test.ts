import {
    describe,
    expect,
    it,
} from "vitest";

import {
    PlatformError,
} from "../../src/foundation/exception.js";

describe(
    "PlatformError",
    () => {

        it(
            "creates a platform error with code and message",
            () => {

                const error =
                    new PlatformError(
                        "TEST_ERROR",
                        "Something went wrong.",
                    );

                expect(
                    error,
                ).toBeInstanceOf(
                    Error,
                );

                expect(
                    error.name,
                ).toBe(
                    "PlatformError",
                );

                expect(
                    error.code,
                ).toBe(
                    "TEST_ERROR",
                );

                expect(
                    error.message,
                ).toBe(
                    "Something went wrong.",
                );

            },
        );

        it(
            "preserves component and details",
            () => {

                const error =
                    new PlatformError(
                        "ENGINE_FAILURE",
                        "Engine failed.",
                        {

                            component:
                                "EngineRuntime",

                            details: {

                                engine:
                                    "engineering.parse-requirements",

                            },

                        },
                    );

                expect(
                    error.component,
                ).toBe(
                    "EngineRuntime",
                );

                expect(
                    error.details,
                ).toEqual({

                    engine:
                        "engineering.parse-requirements",

                });

            },
        );

        it(
            "preserves the original cause",
            () => {

                const cause =
                    new Error(
                        "Underlying failure.",
                    );

                const error =
                    new PlatformError(
                        "BACKEND_FAILURE",
                        "Backend execution failed.",
                        {

                            component:
                                "BackendRuntime",

                            cause,

                        },
                    );

                expect(
                    error.cause,
                ).toBe(
                    cause,
                );

            },
        );

        it(
            "converts to ErrorInfo",
            () => {

                const error =
                    new PlatformError(
                        "VALIDATION_FAILED",
                        "Validation failed.",
                        {

                            details: {

                                field:
                                    "projectName",

                            },

                        },
                    );

                expect(
                    error.toErrorInfo(),
                ).toEqual({

                    code:
                        "VALIDATION_FAILED",

                    message:
                        "Validation failed.",

                    details: {

                        field:
                            "projectName",

                    },

                });

            },
        );

    },
);
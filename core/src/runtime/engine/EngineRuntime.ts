import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
} from "@engineering/shared/engine";

import {
    Logger,
    PlatformError,
} from "@engineering/shared/foundation";

import {
    EngineRegistry,
} from "./EngineRegistry.js";

export class EngineRuntime {

    constructor(
        private readonly registry: EngineRegistry,
        private readonly logger?: Logger,
    ) {}

    async execute(
        engineName: string,
        context: EngineContext,
        request: EngineRequest,
    ): Promise<EngineResult> {

        const startedAt =
            Date.now();

        this.logger?.debug(
            "Engine execution started.",
            {
                engine:
                    engineName,
            },
        );

        let engine: Engine;

        try {

            const resolved =
                await this.registry.get(
                    engineName,
                );

            if (!resolved) {

                throw new PlatformError(
                    "ENGINE_NOT_FOUND",
                    `Engine '${engineName}' is not registered.`,
                    {
                        component:
                            "EngineRuntime",

                        details: {
                            engine:
                                engineName,
                        },
                    },
                );

            }

            engine =
                resolved;

        }
        catch (error) {
            console.log(
                "[ENGINE DEBUG] raw error:",
                error,
            );

            console.log(
                "[ENGINE DEBUG] raw error message:",
                error instanceof Error
                    ? error.message
                    : String(error),
            );

            const platformError =
                error instanceof PlatformError
                    ? error
                    : new PlatformError(
                        "ENGINE_EXECUTION_FAILED",
                        error instanceof Error
                            ? error.message
                            : `Engine '${engineName}' execution failed.`,
                        {
                            component:
                                "EngineRuntime",

                            details: {
                                engine:
                                    engineName,
                            },

                            cause:
                                error,
                        },
                    );

            console.log(
                "[ENGINE DEBUG] platform error:",
                {
                    code:
                        platformError.code,

                    message:
                        platformError.message,

                    cause:
                        platformError.cause,
                },
            );
                    
            this.logger?.error(
                "Engine resolution failed.",
                {
                    engine:
                        engineName,

                    code:
                        platformError.code,

                    error:
                        platformError.message,
                },
            );

            throw platformError;

        }

        try {

            const result =
                await engine.execute(
                    context,
                    request,
                );

            this.logger?.debug(
                "Engine execution completed.",
                {
                    engine:
                        engineName,

                    durationMs:
                        Date.now() -
                        startedAt,

                    artifactCount:
                        result.output.artifacts?.length ?? 0,
                },
            );

            return result;

        }
        catch (error) {

            const platformError =
                error instanceof PlatformError
                    ? error
                    : new PlatformError(
                        "ENGINE_EXECUTION_FAILED",
                        error instanceof Error
                            ? error.message
                            : `Engine '${engineName}' execution failed.`,
                        {
                            component:
                                "EngineRuntime",

                            details: {
                                engine:
                                    engineName,
                            },

                            cause:
                                error,
                        },
                    );

            this.logger?.error(
                "Engine execution failed.",
                {
                    engine:
                        engineName,

                    code:
                        platformError.code,

                    error:
                        platformError.message,

                    durationMs:
                        Date.now() -
                        startedAt,
                },
            );

            throw platformError;

        }

    }

    async exists(
        engineName: string,
    ): Promise<boolean> {

        return this.registry.exists(
            engineName,
        );

    }

    async list(): Promise<readonly Engine[]> {

        return this.registry.list();

    }

}

import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
} from "@engineering/shared/engine";

import {
    PlatformError,
    Logger,
} from "@engineering/shared";

import { EngineRegistry } from "./EngineRegistry.js";

export class EngineRuntime {

    constructor(

        private readonly registry:
            EngineRegistry,

        private readonly logger?:
            Logger,

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

        const engine =
            await this.registry.get(
                engineName,
            );

        if (!engine) {

            const error =
                new PlatformError(
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

            this.logger?.error(
                "Engine resolution failed.",
                {
                    engine:
                        engineName,

                    code:
                        error.code,

                    error:
                        error.message,

                },
            );

            throw error;

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
                        Date.now() - startedAt,

                },
            );

            return result;

        }
        catch (error) {

            this.logger?.error(
                "Engine execution failed.",
                {
                    engine:
                        engineName,

                    error:
                        error instanceof Error
                            ? error.message
                            : String(error),
                },
            );

            throw error;

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
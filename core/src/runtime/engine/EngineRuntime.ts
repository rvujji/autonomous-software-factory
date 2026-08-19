import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
} from "@engineering/shared/engine";

import { EngineRegistry } from "./EngineRegistry.js";
import {Logger,PlatformError,} from "@engineering/shared/foundation";

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

        this.logger?.debug("Engine execution started.",{engine:engineName,},);
        const engine = await this.registry.get(engineName);

        if (!engine) {
            throw new Error(
                `Engine '${engineName}' is not registered.`,
            );
        }
        try{
            const result  = await engine.execute(
                context,
                request,
            );
            this.logger?.debug("Engine execution completed.",{engine:engineName,},);
            return result;
        }
        catch (error) {
            this.logger?.error("Engine execution failed.",
                {
                    engine:engineName,
                    error:error instanceof Error? error.message: String(error),
                },
            );
            throw error;
        }

    }

    async exists(
        engineName: string,
    ): Promise<boolean> {

        return this.registry.exists(engineName);

    }

    async list(): Promise<readonly Engine[]> {

        return this.registry.list();

    }

}
import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
} from "@engineering/shared/engine";

import { EngineRegistry } from "./EngineRegistry.js";

export class EngineRuntime {

    constructor(
        private readonly registry: EngineRegistry,
    ) {}

    async execute(
        engineName: string,
        context: EngineContext,
        request: EngineRequest,
    ): Promise<EngineResult> {

        const engine = await this.registry.get(engineName);

        if (!engine) {
            throw new Error(
                `Engine '${engineName}' is not registered.`,
            );
        }

        return engine.execute(
            context,
            request,
        );

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
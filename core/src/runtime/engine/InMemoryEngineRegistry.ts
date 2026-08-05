import { Engine } from "../../../../shared/src/engine/index.js";

import { EngineRegistry } from "./EngineRegistry.js";

/**
 * In-memory implementation of EngineRegistry.
 *
 * Intended for unit tests and early runtime development.
 */
export class InMemoryEngineRegistry implements EngineRegistry {

    private readonly engines = new Map<string, Engine>();

    async register(
        engine: Engine,
    ): Promise<void> {

        const name = engine.specification.name;

        if (this.engines.has(name)) {
            throw new Error(
                `Engine '${name}' is already registered.`,
            );
        }

        this.engines.set(
            name,
            engine,
        );

    }

    async unregister(
        name: string,
    ): Promise<void> {

        this.engines.delete(name);

    }

    async get(
        name: string,
    ): Promise<Engine | undefined> {

        return this.engines.get(name);

    }

    async exists(
        name: string,
    ): Promise<boolean> {

        return this.engines.has(name);

    }

    async list(): Promise<readonly Engine[]> {

        return [...this.engines.values()];

    }

}
import { Engine } from "../../../../shared/src/engine/index.js";

export interface EngineRegistry {

    register(
        engine: Engine,
    ): Promise<void>;

    unregister(
        name: string,
    ): Promise<void>;

    get(
        name: string,
    ): Promise<Engine | undefined>;

    exists(
        name: string,
    ): Promise<boolean>;

    list(): Promise<readonly Engine[]>;

}
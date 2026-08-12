import { Backend } from "@engineering/backend-shared";

export interface BackendRegistry {

    register(
        backend: Backend,
    ): Promise<void>;

    unregister(
        name: string,
    ): Promise<void>;

    get(
        name: string,
    ): Promise<Backend | undefined>;

    has(
        name: string,
    ): Promise<boolean>;

    list(): Promise<readonly Backend[]>;

}
import {
    Backend,
} from "@engineering/backend-shared";

import {
    BackendRegistry,
} from "./BackendRegistry.js";

export class InMemoryBackendRegistry
implements BackendRegistry {

    private readonly backends =
        new Map<string, Backend>();

    async register(
        backend: Backend,
    ): Promise<void> {

        if (!backend.name.trim()) {

            throw new Error(
                "Backend name is required.",
            );

        }

        if (!backend.version.trim()) {

            throw new Error(
                `Backend '${backend.name}' version is required.`,
            );

        }

        if (backend.capabilities.length === 0) {

            throw new Error(
                `Backend '${backend.name}' must declare at least one capability.`,
            );

        }

        if (
            this.backends.has(
                backend.name,
            )
        ) {

            throw new Error(
                `Backend '${backend.name}' is already registered.`,
            );

        }

        this.backends.set(
            backend.name,
            backend,
        );

    }

    async unregister(
        name: string,
    ): Promise<void> {

        this.backends.delete(
            name,
        );

    }

    async get(
        name: string,
    ): Promise<Backend | undefined> {

        return this.backends.get(
            name,
        );

    }

    async has(
        name: string,
    ): Promise<boolean> {

        return this.backends.has(
            name,
        );

    }

    async list(): Promise<readonly Backend[]> {

        return [
            ...this.backends.values(),
        ];

    }

}
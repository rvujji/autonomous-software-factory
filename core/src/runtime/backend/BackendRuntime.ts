import {
    BackendConfiguration,
    BackendResult,
    BackendTask,
} from "@engineering/backend-shared";

import {
    BackendRegistry,
} from "./BackendRegistry.js";

export class BackendRuntime {

    constructor(
        private readonly registry: BackendRegistry,
    ) {}

    async register(
        backend: Parameters<
            BackendRegistry["register"]
        >[0],
    ): Promise<void> {

        await this.registry.register(
            backend,
        );

    }

    async unregister(
        name: string,
    ): Promise<void> {

        await this.registry.unregister(
            name,
        );

    }

    async resolve(
        name: string,
    ) {

        const backend =
            await this.registry.get(
                name,
            );

        if (!backend) {

            throw new Error(
                `Backend '${name}' was not found.`,
            );

        }

        return backend;

    }

    async execute(
        backendName: string,
        task: BackendTask,
        configuration?: BackendConfiguration,
    ): Promise<BackendResult> {

        const backend =
            await this.resolve(
                backendName,
            );

        return backend.execute(
            task,
            configuration,
        );

    }

    async list() {

        return this.registry.list();

    }

}
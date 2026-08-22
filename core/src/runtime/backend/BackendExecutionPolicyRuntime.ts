import {
    BackendExecutionPolicy,
} from "./BackendExecutionPolicy.js";

import {
    BackendExecutionPolicyRegistry,
} from "./BackendExecutionPolicyRegistry.js";

export class BackendExecutionPolicyRuntime {

    constructor(
        private readonly registry:
            BackendExecutionPolicyRegistry,
    ) {}

    async register(
        policy: BackendExecutionPolicy,
    ): Promise<void> {

        await this.registry.register(
            policy,
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
    ): Promise<BackendExecutionPolicy> {

        const policy =
            await this.registry.get(
                name,
            );

        if (!policy) {

            throw new Error(
                `Backend execution policy '${name}' was not found.`,
            );

        }

        return policy;

    }

    async list(): Promise<
        readonly BackendExecutionPolicy[]
    > {

        return this.registry.list();

    }

}
import {
    BackendExecutionPolicy,
} from "./BackendExecutionPolicy.js";

import {
    BackendExecutionPolicyRegistry,
} from "./BackendExecutionPolicyRegistry.js";

export class InMemoryBackendExecutionPolicyRegistry
implements BackendExecutionPolicyRegistry {

    private readonly policies =
        new Map<string, BackendExecutionPolicy>();

    async register(
        policy: BackendExecutionPolicy,
    ): Promise<void> {

        if (
            this.policies.has(
                policy.name,
            )
        ) {

            throw new Error(
                `Backend execution policy '${policy.name}' is already registered.`,
            );

        }

        this.policies.set(
            policy.name,
            policy,
        );

    }

    async unregister(
        name: string,
    ): Promise<void> {

        this.policies.delete(
            name,
        );

    }

    async get(
        name: string,
    ): Promise<BackendExecutionPolicy | undefined> {

        return this.policies.get(
            name,
        );

    }

    async has(
        name: string,
    ): Promise<boolean> {

        return this.policies.has(
            name,
        );

    }

    async list(): Promise<
        readonly BackendExecutionPolicy[]
    > {

        return [
            ...this.policies.values(),
        ];

    }

}
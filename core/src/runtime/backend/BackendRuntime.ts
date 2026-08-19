import {
    BackendConfiguration,
    BackendResult,
    BackendTask,
} from "@engineering/backend-shared";

import {
    BackendRegistry,
} from "./BackendRegistry.js";
import {Logger,} from "@engineering/shared/foundation";

export class BackendRuntime {

    constructor(
        private readonly registry: BackendRegistry,
        private readonly logger?: Logger,
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
        this.logger?.debug("Backend execution started.",{backend:backendName,},);
        const backend =
            await this.resolve(
                backendName,
            );
        try{        
            const result = await backend.execute(
                task,
                configuration,
            );
            this.logger?.debug("Backend execution completed.",
                {
                    backend:backendName,
                    outputKind:result.outputs[0]?.kind,
                    outputPreview:result.outputs[0]?.kind === "INLINE"? String(result.outputs[0].content).slice(0, 300): undefined,
                },
            );
            return result;
        }
        catch (error) {
            this.logger?.error("Backend execution failed.",
                {
                    backend:backendName,
                    error:error instanceof Error? error.message: String(error),
                },
            );
            throw error;
        }
    }

    async list() {

        return this.registry.list();

    }

}
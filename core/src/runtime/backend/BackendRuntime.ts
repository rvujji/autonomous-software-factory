import {
    BackendConfiguration,
    BackendResult,
    BackendTask,
} from "@engineering/backend-shared";

import {
    BackendRegistry,
} from "./BackendRegistry.js";
import {Logger,PlatformError,} from "@engineering/shared/foundation";

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

        const startedAt =
            Date.now();

        this.logger?.debug(
            "Backend execution started.",
            {
                backend:
                    backendName,

                task:
                    task.name,

                taskId:
                    task.id,
            },
        );

        let backend;

        try {

            backend =
                await this.resolve(
                    backendName,
                );

        }
        catch (error) {

            const platformError =
                error instanceof PlatformError
                    ? error
                    : new PlatformError(
                        "BACKEND_RESOLUTION_FAILED",
                        `Backend '${backendName}' could not be resolved.`,
                        {
                            component:
                                "BackendRuntime",

                            details: {
                                backend:
                                    backendName,
                            },

                            cause:
                                error,
                        },
                    );

            this.logger?.error(
                "Backend resolution failed.",
                {
                    backend:
                        backendName,

                    task:
                        task.name,

                    taskId:
                        task.id,

                    code:
                        platformError.code,

                    error:
                        platformError.message,
                },
            );

            throw platformError;

        }

        try {

            const result =
                await backend.execute(
                    task,
                    configuration,
                );

            const output =
                result.outputs[0];

            this.logger?.debug(
                "Backend execution completed.",
                {
                    backend: backendName,
                    task: task.name,
                    taskId: task.id,

                    outputKind:
                        output?.kind,

                    outputLength:
                        output?.kind === "INLINE" &&
                        typeof output.content === "string"
                            ? output.content.length
                            : undefined,

                    outputPreview:
                        output?.kind === "INLINE" &&
                        typeof output.content === "string"
                            ? output.content.slice(0, 1000)
                            : undefined,

                    outputTail:
                        output?.kind === "INLINE" &&
                        typeof output.content === "string"
                            ? output.content.slice(-1000)
                            : undefined,
                },
            );

            return result;

        }
        catch (error) {

            const platformError =
                error instanceof PlatformError
                    ? error
                    : new PlatformError(
                        "BACKEND_EXECUTION_FAILED",
                        `Backend '${backendName}' execution failed.`,
                        {
                            component:
                                "BackendRuntime",

                            details: {
                                backend:
                                    backendName,

                                task:
                                    task.name,

                                taskId:
                                    task.id,
                            },

                            cause:
                                error,
                        },
                    );

            this.logger?.error(
                "Backend execution failed.",
                {
                    backend:
                        backendName,

                    task:
                        task.name,

                    taskId:
                        task.id,

                    code:
                        platformError.code,

                    error:
                        platformError.message,

                    durationMs:
                        Date.now() -
                        startedAt,
                },
            );

            throw platformError;

        }

    }

    async list() {

        return this.registry.list();

    }

}
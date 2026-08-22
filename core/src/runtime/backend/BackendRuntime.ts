import {
    BackendConfiguration,
    BackendExecutionCandidate,
    BackendResult,
    BackendStatus,
    BackendTask,
} from "@engineering/backend-shared";

import {
    BackendRegistry,
} from "./BackendRegistry.js";

import {
    Logger,
    PlatformError,
} from "@engineering/shared/foundation";

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

        return this.executeCandidate(
            {
                backend:
                    backendName,

                ...(configuration && {
                    configuration,
                }),

            },
            task,
        );

    }

    async executeCandidates(
        candidates: readonly BackendExecutionCandidate[],
        task: BackendTask,
    ): Promise<BackendResult> {

        if (
            candidates.length === 0
        ) {

            throw new PlatformError(
                "BACKEND_CANDIDATES_EMPTY",
                "At least one backend execution candidate is required.",
                {
                    component:
                        "BackendRuntime",
                },
            );

        }

        let lastResult:
            BackendResult | undefined;

        for (
            let index = 0;
            index < candidates.length;
            index++
        ) {

            const candidate =
                candidates[index];

            if (!candidate) {

                continue;

            }

            this.logger?.debug(
                "Backend candidate execution started.",
                {
                    backend:
                        candidate.backend,

                    model:
                        candidate.model,

                    task:
                        task.name,

                    taskId:
                        task.id,

                    candidateIndex:
                        index,

                    candidateCount:
                        candidates.length,
                },
            );

            try {

                const result =
                    await this.executeCandidate(
                        candidate,
                        task,
                    );

                lastResult =
                    result;

                if (
                    result.status ===
                    BackendStatus.SUCCEEDED
                ) {

                    this.logger?.debug(
                        "Backend candidate succeeded.",
                        {
                            backend:
                                candidate.backend,

                            model:
                                candidate.model,

                            task:
                                task.name,

                            taskId:
                                task.id,

                            candidateIndex:
                                index,

                        },
                    );

                    return result;

                }

                this.logger?.warn?.(
                    "Backend candidate returned a failed result.",
                    {
                        backend:
                            candidate.backend,

                        model:
                            candidate.model,

                        task:
                            task.name,

                        taskId:
                            task.id,

                        candidateIndex:
                            index,

                        code:
                            result.error?.code,

                        error:
                            result.error?.message,
                    },
                );

            }
            catch (error) {

                const platformError =
                    error instanceof PlatformError
                        ? error
                        : new PlatformError(
                            "BACKEND_CANDIDATE_EXECUTION_FAILED",
                            `Backend '${candidate.backend}' execution failed.`,
                            {
                                component:
                                    "BackendRuntime",

                                details: {
                                    backend:
                                        candidate.backend,

                                    model:
                                        candidate.model,

                                    task:
                                        task.name,

                                    taskId:
                                        task.id,

                                    candidateIndex:
                                        index,
                                },

                                cause:
                                    error,
                            },
                        );

                this.logger?.error(
                    "Backend candidate execution failed.",
                    {
                        backend:
                            candidate.backend,

                        model:
                            candidate.model,

                        task:
                            task.name,

                        taskId:
                            task.id,

                        candidateIndex:
                            index,

                        code:
                            platformError.code,

                        error:
                            platformError.message,
                    },
                );

            }

        }

        if (lastResult) {

            return lastResult;

        }

        throw new PlatformError(
            "BACKEND_CANDIDATES_FAILED",
            "All backend execution candidates failed without returning a result.",
            {
                component:
                    "BackendRuntime",

                details: {
                    task:
                        task.name,

                    taskId:
                        task.id,

                    candidates:
                        candidates.map(
                            candidate =>
                                candidate.model
                                    ? `${candidate.backend}/${candidate.model}`
                                    : candidate.backend,
                        ),
                },
            },
        );

    }

    private async executeCandidate(
        candidate: BackendExecutionCandidate,
        task: BackendTask,
    ): Promise<BackendResult> {

        const startedAt =
            Date.now();

        const backendName =
            candidate.backend;

        this.logger?.debug(
            "Backend execution started.",
            {
                backend:
                    backendName,

                model:
                    candidate.model,

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

                                model:
                                    candidate.model,
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

                    model:
                        candidate.model,

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

            const configuration =
                candidate.model
                    ? {

                        ...(candidate.configuration ?? {}),

                        model:
                            candidate.model,

                    }
                    : candidate.configuration;

            const result =
                await backend.execute(
                    task,
                    configuration,
                    candidate.model,
                );

            const output =
                result.outputs[0];

            this.logger?.debug(
                "Backend execution completed.",
                {
                    backend:
                        backendName,

                    model:
                        candidate.model,

                    task:
                        task.name,

                    taskId:
                        task.id,

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
                            ? output.content.slice(
                                0,
                                1000,
                            )
                            : undefined,

                    outputTail:
                        output?.kind === "INLINE" &&
                        typeof output.content === "string"
                            ? output.content.slice(
                                -1000,
                            )
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

                                model:
                                    candidate.model,

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

                    model:
                        candidate.model,

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
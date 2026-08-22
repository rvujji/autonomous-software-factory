export interface BackendConfiguration {

    /**
     * Model selected for this execution attempt.
     *
     * The BackendRuntime selects the candidate.
     * Concrete backends interpret the model identifier.
     */
    readonly model?: string;

    readonly timeoutMs?: number;

    readonly workingDirectory?: string;

    readonly environment?: Readonly<Record<string, string>>;

    readonly retryCount?: number;

    readonly stream?: boolean;

    readonly approvalRequired?: boolean;

}
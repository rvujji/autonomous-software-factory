export interface BackendConfiguration {

    readonly timeoutMs?: number;

    readonly workingDirectory?: string;

    readonly environment?: Readonly<Record<string, string>>;

    readonly retryCount?: number;

    readonly stream?: boolean;

    readonly approvalRequired?: boolean;

}
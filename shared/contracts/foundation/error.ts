export interface ErrorInfo {

    readonly code: string;

    readonly message: string;

    readonly details?: unknown;
}
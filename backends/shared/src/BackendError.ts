export interface BackendError {

    readonly code: string;

    readonly message: string;

    readonly cause?: unknown;

}
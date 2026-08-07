import { BackendError } from "./BackendError.js";

export interface ToolResult {

    readonly toolCallId: string;

    readonly succeeded: boolean;

    readonly output?: unknown;

    readonly error?: BackendError;

    readonly completedAt: Date;

}
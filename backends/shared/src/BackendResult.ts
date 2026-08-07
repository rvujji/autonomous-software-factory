import { BackendError } from "./BackendError.js";
import { BackendLog } from "./BackendLog.js";
import { BackendMetrics } from "./BackendMetrics.js";
import { BackendOutputTarget } from "./BackendOutputTarget.js";
import { BackendStatus } from "./BackendStatus.js";
import { ToolCall } from "./ToolCall.js";
import { ToolResult } from "./ToolResult.js";

export interface BackendResult {

    readonly contractVersion: string;

    readonly executionId: string;

    readonly status: BackendStatus;

    readonly outputs: readonly BackendOutputTarget[];

    readonly logs: readonly BackendLog[];

    readonly metrics?: BackendMetrics;

    readonly toolCalls: readonly ToolCall[];

    readonly toolResults: readonly ToolResult[];

    readonly error?: BackendError;

}
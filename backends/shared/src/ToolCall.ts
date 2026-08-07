export interface ToolCall {

    readonly id: string;

    readonly tool: string;

    readonly arguments: unknown;

    readonly startedAt: Date;

}
import {
    BackendResult,
    BackendStatus,
} from "@engineering/backend-shared";

import { CliResult } from "@engineering/backend-cli";

interface OpenCodeEvent {

    readonly type?: string;

    readonly part?: {

        readonly type?: string;

        readonly text?: string;

        readonly reason?: string;

        readonly tokens?: unknown;

        readonly [key: string]: unknown;

    };

    readonly [key: string]: unknown;

}

export class OpenCodeResultMapper {

    map(
        executionId: string,
        result: CliResult,
    ): BackendResult {

        console.debug(
            "[OPENCODE] result:map:start",
            {
                executionId,

                exitCode:
                    result.exitCode,

                stdoutLength:
                    result.standardOutput.length,

                stderrLength:
                    result.standardError.length,
            },
        );

        if (
            result.exitCode !== 0
        ) {

            console.error(
                "[OPENCODE] result:process-failed",
                {
                    executionId,

                    exitCode:
                        result.exitCode,

                    stdout:
                        result.standardOutput.slice(
                            0,
                            2000,
                        ),

                    stderr:
                        result.standardError.slice(
                            0,
                            4000,
                        ),
                },
            );

            return {

                contractVersion:
                    "1.0",

                executionId,

                status:
                    BackendStatus.FAILED,

                outputs: [

                    {

                        kind:
                            "INLINE",

                        content:
                            result.standardOutput,

                    },

                ],

                logs: [],

                toolCalls: [],

                toolResults: [],

                error: {

                    code:
                        `OPENCODE_EXIT_${result.exitCode}`,

                    message:
                        result.standardError ||
                        "OpenCode execution failed.",

                    cause: {

                        exitCode:
                            result.exitCode,

                        standardOutput:
                            result.standardOutput,

                        standardError:
                            result.standardError,

                    },

                },

            };

        }

        const events =
            this.parseEvents(
                result.standardOutput,
            );

        const eventSummary =
            events.map(
                (event, index) => ({

                    index,

                    type:
                        event.type,

                    partType:
                        event.part?.type,

                    textLength:
                        typeof event.part?.text === "string"
                            ? event.part.text.length
                            : 0,

                    reason:
                        event.part?.reason,

                    tokens:
                        event.part?.tokens,

                }),
            );

        console.debug(
            "[OPENCODE] result:event-summary",
            eventSummary,
        );

        const text =
            this.extractText(
                events,
            );

        console.debug(
            "[OPENCODE] result:text-extracted",
            {
                executionId,

                textLength:
                    text.length,

                textPreview:
                    text.slice(
                        0,
                        1000,
                    ),

                textTail:
                    text.slice(
                        -1000,
                    ),
            },
        );

        if (
            !text.trim()
        ) {

            const finishEvents =
                events.filter(
                    event =>
                        event.type === "step_finish",
                );

            const finishReasons =
                finishEvents.map(
                    event =>
                        event.part?.reason ??
                        "unknown",
                );

            const tokenSummaries =
                finishEvents.map(
                    event =>
                        event.part?.tokens,
                );

            console.error(
                "[OPENCODE] result:no-text-output",
                {
                    executionId,

                    exitCode:
                        result.exitCode,

                    eventCount:
                        events.length,

                    finishEventCount:
                        finishEvents.length,

                    finishReasons,

                    tokenSummaries,

                    stdout:
                        result.standardOutput.slice(
                            0,
                            4000,
                        ),

                    stderr:
                        result.standardError.slice(
                            0,
                            4000,
                        ),
                },
            );

            return {

                contractVersion:
                    "1.0",

                executionId,

                status:
                    BackendStatus.FAILED,

                outputs: [],

                logs: [],

                toolCalls: [],

                toolResults: [],

                error: {

                    code:
                        "OPENCODE_EMPTY_OUTPUT",

                    message:
                        this.buildEmptyOutputMessage(
                            finishReasons,
                        ),

                    cause: {

                        stdout:
                            result.standardOutput,

                        stderr:
                            result.standardError,

                        eventCount:
                            events.length,

                        finishReasons,

                        tokenSummaries,

                    },

                },

            };

        }

        console.debug(
            "[OPENCODE] result:map:success",
            {
                executionId,

                outputLength:
                    text.length,
            },
        );

        return {

            contractVersion:
                "1.0",

            executionId,

            status:
                BackendStatus.SUCCEEDED,

            outputs: [

                {

                    kind:
                        "INLINE",

                    content:
                        text,

                },

            ],

            logs: [],

            toolCalls: [],

            toolResults: [],

        };

    }

    private parseEvents(
        output: string,
    ): readonly OpenCodeEvent[] {

        const lines =
            output
                .split("\n")
                .map(
                    line =>
                        line.trim(),
                )
                .filter(
                    Boolean,
                );

        const events: OpenCodeEvent[] = [];

        let invalidJsonLines =
            0;

        for (
            const line
            of lines
        ) {

            let parsed: unknown;

            try {

                parsed =
                    JSON.parse(
                        line,
                    );

            }
            catch {

                invalidJsonLines +=
                    1;

                continue;

            }

            if (
                typeof parsed !== "object" ||
                parsed === null
            ) {

                invalidJsonLines +=
                    1;

                continue;

            }

            events.push(
                parsed as OpenCodeEvent,
            );

        }

        if (
            invalidJsonLines > 0
        ) {

            console.warn(
                "[OPENCODE] result:invalid-event-lines",
                {
                    lineCount:
                        lines.length,

                    invalidJsonLines,

                    validEvents:
                        events.length,
                },
            );

        }

        return events;

    }

    private extractText(
        events: readonly OpenCodeEvent[],
    ): string {

        return events

            .filter(
                event =>
                    event.type === "text" &&
                    event.part?.type === "text",
            )

            .map(
                event =>
                    event.part?.text ?? "",
            )

            .join("");

    }

    private buildEmptyOutputMessage(
        finishReasons: readonly string[],
    ): string {

        if (
            finishReasons.length === 0
        ) {

            return (
                "OpenCode completed successfully " +
                "but produced no text output and no step_finish event."
            );

        }

        return (
            "OpenCode completed successfully " +
            "but produced no text output. " +
            `Finish reason: ${finishReasons.join(", ")}.`
        );

    }

}
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

    };

}

export class OpenCodeResultMapper {

    map(
        executionId: string,
        result: CliResult,
    ): BackendResult {

        if (result.exitCode !== 0) {

            return {

                contractVersion: "1.0",

                executionId,

                status:
                    BackendStatus.FAILED,

                outputs: [

                    {

                        kind: "INLINE",

                        content: result.standardOutput,

                    },

                ],

                logs: [],

                toolCalls: [],

                toolResults: [],

                error: {

                    code:
                        String(result.exitCode),

                    message:
                        result.standardError ||
                        "OpenCode execution failed.",

                },

            };

        }

        const events =
            this.parseEvents(
                result.standardOutput,
            );

        const text =
            this.extractText(
                events,
            );

        return {

            contractVersion: "1.0",

            executionId,

            status:
                BackendStatus.SUCCEEDED,

            outputs: [

                {

                    kind: "INLINE",

                    content: text,

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
                    line => line.trim(),
                )
                .filter(
                    Boolean,
                );

        const events: OpenCodeEvent[] = [];

        for (
            const line
            of lines
        ) {

            let parsed: unknown;

            try {

                parsed =
                    JSON.parse(line);

            }
            catch {

                continue;

            }

            if (
                typeof parsed !== "object" ||
                parsed === null
            ) {

                continue;

            }

            events.push(
                parsed as OpenCodeEvent,
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

}
import {
    BackendResult,
    BackendStatus,
} from "@engineering/backend-shared";

import {
    CliResult,
} from "@engineering/backend-cli";

export class OllamaResultMapper {

    map(
        executionId: string,
        result: CliResult,
    ): BackendResult {

        if (
            result.exitCode !== 0
        ) {

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
                        `OLLAMA_EXIT_${result.exitCode}`,

                    message:
                        result.standardError ||
                        "Ollama execution failed.",

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

        const text =
            result.standardOutput.trim();

        if (!text) {

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
                        "OLLAMA_EMPTY_OUTPUT",

                    message:
                        "Ollama completed successfully but produced no output.",

                    cause: {

                        standardOutput:
                            result.standardOutput,

                        standardError:
                            result.standardError,

                    },

                },

            };

        }

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

}
import {
    BackendResult,
    BackendStatus,
} from "@engineering/backend-shared";

import { CliResult } from "@engineering/backend-cli";

export class OpenCodeResultMapper {

    map(
        executionId: string,
        result: CliResult,
    ): BackendResult {

        return {

            contractVersion: "1.0",

            executionId,

            status:
                result.exitCode === 0
                    ? BackendStatus.SUCCEEDED
                    : BackendStatus.FAILED,

            outputs: [
                {
                    kind: "INLINE",
                    content: result.standardOutput,
                },
            ],

            logs: [],

            toolCalls: [],

            toolResults: [],

            ...(result.exitCode !== 0 && {
                error: {
                    code: String(result.exitCode),
                    message: result.standardError,
                },
            }),

        };

    }

}
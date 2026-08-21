import {
    describe,
    expect,
    it,
} from "vitest";

import {
    NodeCliProcess,
} from "../src/NodeCliProcess.js";

describe(
    "NodeCliProcess",
    () => {

        const cliProcess =
            new NodeCliProcess();

        it(
            "executes a command and captures stdout",
            async () => {

                const result =
                    await cliProcess.execute({

                        executable:
                            "node",

                        arguments: [
                            "-e",
                            "process.stdout.write('CLI_OK')",
                        ],

                    });

                expect(
                    result.exitCode,
                ).toBe(0);

                expect(
                    result.standardOutput,
                ).toBe("CLI_OK");

                expect(
                    result.standardError,
                ).toBe("");

            },
        );

        it(
            "captures stderr",
            async () => {

                const result =
                    await cliProcess.execute({

                        executable:
                            "node",

                        arguments: [
                            "-e",
                            "process.stderr.write('CLI_ERROR')",
                        ],

                    });

                expect(
                    result.exitCode,
                ).toBe(0);

                expect(
                    result.standardError,
                ).toBe("CLI_ERROR");

            },
        );

        it(
            "returns a non-zero exit code without rejecting",
            async () => {

                const result =
                    await cliProcess.execute({

                        executable:
                            "node",

                        arguments: [
                            "-e",
                            "process.exit(7)",
                        ],

                    });

                expect(
                    result.exitCode,
                ).toBe(7);

            },
        );

        it(
            "passes standard input to the process",
            async () => {

                const result =
                    await cliProcess.execute({

                        executable:
                            "node",

                        arguments: [
                            "-e",
                            "process.stdin.on('data', data => process.stdout.write(data.toString()))",
                        ],

                        standardInput:
                            "INPUT_OK",

                    });

                expect(
                    result.exitCode,
                ).toBe(0);

                expect(
                    result.standardOutput,
                ).toBe("INPUT_OK");

            },
        );

        it(
            "uses the supplied working directory",
            async () => {

                const result =
                    await cliProcess.execute({

                        executable:
                            "node",

                        arguments: [
                            "-e",
                            "process.stdout.write(process.cwd())",
                        ],

                        workingDirectory:
                            process.cwd(),

                    });

                expect(
                    result.exitCode,
                ).toBe(0);

                expect(
                    result.standardOutput,
                ).toBe(
                    process.cwd(),
                );

            },
        );

        it(
            "rejects when the executable cannot be started",
            async () => {

                await expect(

                    cliProcess.execute({

                        executable:
                            "__definitely_missing_cli__",

                        arguments: [],

                    }),

                ).rejects.toBeDefined();

            },
        );

    },
);
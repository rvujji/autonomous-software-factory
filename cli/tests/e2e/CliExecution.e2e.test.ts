import {
    describe,
    expect,
    it,
} from "vitest";

import {
    DefaultPlatform,
} from "@engineering/platform";

import {
    CliRuntime,
} from "../../src/CliRuntime.js";

describe(
    "CLI E2E",
    () => {

        it(
            "executes a real pipeline through the platform",
            async () => {

                const platform =
                    await DefaultPlatform.create();

                const runtime =
                    new CliRuntime(
                        platform,
                    );

                const result =
                    await runtime.execute({

                        kind:
                            "EXECUTE",

                        pipeline:
                            "engineering.requirements",

                        inputFile:
                            new URL(
                                "./requirements.md",
                                import.meta.url,
                            ).pathname,

                    });

                    expect(
                        result,
                    ).toMatchObject({

                        state:
                            "COMPLETED",

                        pipeline:
                            "engineering.requirements",

                    });

                    expect(
                        result.artifacts,
                    ).toHaveLength(1);

                    expect(
                        result.artifacts[0]?.type,
                    ).toBe(
                        "VALIDATED_REQUIREMENTS",
                    );

            },

            120_000,

        );

    },
);
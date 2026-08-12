import {
    mkdtemp,
    readFile,
    rm,
    writeFile,
} from "node:fs/promises";

import {
    tmpdir,
} from "node:os";

import {
    join,
} from "node:path";

import {
    describe,
    expect,
    it,
} from "vitest";

import {
    BackendStatus,
    BackendTask,
} from "@engineering/backend-shared";

import {
    NodeCliProcess,
} from "@engineering/backend-cli";

import {
    OpenCodeBackend,
} from "../src/OpenCodeBackend.js";

import {
    BackendCapability,
    BackendStatus,
    BackendTask,
} from "@engineering/backend-shared";
describe(
    "OpenCodeBackend E2E",
    () => {

        it(
            "executes a Markdown engineering task and creates a workspace artifact",
            async () => {

                const workspace =
                    await mkdtemp(
                        join(
                            tmpdir(),
                            "engineering-platform-",
                        ),
                    );

                try {

                    const sourcePath =
                        join(
                            workspace,
                            "requirements.md",
                        );

                    const outputDirectory =
                        join(
                            workspace,
                            "output",
                        );

                    const outputPath =
                        join(
                            outputDirectory,
                            "engineering-result.md",
                        );

                    await writeFile(

                        sourcePath,

                        [
                            "# Engineering Requirement",
                            "",
                            "The system must provide a health check endpoint.",
                            "",
                            "The endpoint must return HTTP 200 when the service is healthy.",
                            "",
                        ].join("\n"),

                        "utf8",

                    );

                    const backend =
                        new OpenCodeBackend(

                            new NodeCliProcess(),

                            {

                                executable:
                                    "opencode",

                                arguments: [],

                                format:
                                    "json",

                            },

                        );
                    
                    expect(
                        backend.capabilities,
                    ).toEqual(
                        expect.arrayContaining([
                            BackendCapability.FILESYSTEM,
                            BackendCapability.CODE_GENERATION,
                            BackendCapability.DOCUMENT_GENERATION,
                        ]),
                    );

                    const task: BackendTask = {

                        contractVersion:
                            "1.0",

                        id:
                            "e2e-opencode-workspace",

                        name:
                            "Create Engineering Artifact",

                        description:
                            "Create an engineering artifact from Markdown requirements.",

                        objective:
                            [
                                "Read the supplied Markdown requirements.",
                                "Create the directory output if it does not exist.",
                                "Create output/engineering-result.md.",
                                "The file must summarize the requirement and identify the required health check behavior.",
                            ].join(" "),

                        instructions: [

                            "Use the supplied Markdown file as the source of truth.",

                            "Do not modify the source Markdown file.",

                            "Create the requested output file in the workspace.",

                            "Do not create files outside the workspace.",

                        ],

                        inputs: [

                            {

                                id:
                                    "requirements",

                                name:
                                    "Requirements Markdown",

                                description:
                                    "Engineering requirements supplied as Markdown.",

                                type:
                                    "MARKDOWN",

                                required:
                                    true,

                                source: {

                                    kind:
                                        "FILE",

                                    path:
                                        sourcePath,

                                },

                                metadata: {},

                            },

                        ],

                        context: [],

                        expectedOutputs: [

                            {

                                id:
                                    "engineering-result",

                                name:
                                    "Engineering Result",

                                description:
                                    "Engineering result generated from the requirements.",

                                type:
                                    "MARKDOWN_FILE",

                                required:
                                    true,

                            },

                        ],

                        metadata: {},

                    };

                    const result =
                        await backend.execute(

                            task,

                            {

                                workingDirectory:
                                    workspace,

                                approvalRequired:
                                    false,

                            },

                        );

                    expect(
                        result.status,
                    ).toBe(
                        BackendStatus.SUCCEEDED,
                    );

                    const outputContent =
                        await readFile(
                            outputPath,
                            "utf8",
                        );

                    expect(
                        outputContent.length,
                    ).toBeGreaterThan(0);

                    expect(
                        outputContent.toLowerCase(),
                    ).toContain(
                        "health check",
                    );

                    expect(
                        outputContent,
                    ).toContain(
                        "200",
                    );

                } finally {

                    await rm(
                        workspace,
                        {
                            recursive: true,
                            force: true,
                        },
                    );

                }

            },

            120_000,

        );

    },
);
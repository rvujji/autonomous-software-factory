import {
    BackendStatus,
    BackendTask,
} from "@engineering/backend-shared";

import {
    NodeCliProcess,
} from "@engineering/backend-cli";

import {
    OllamaBackend,
} from "./src/OllamaBackend.js";

const backend =
    new OllamaBackend(
        new NodeCliProcess(),
        {
            executable: "ollama",
            arguments: [],
            model: "qwen2.5-coder:7b",
        },
    );

const task: BackendTask = {

    contractVersion:
        "1.0",

    id:
        "ollama-live-e2e",

    name:
        "Ollama Live E2E",

    objective:
        "Write a TypeScript function named add that accepts two numbers and returns their sum.",

    instructions: [

        "Return only the TypeScript function.",

        "Do not use Markdown fences.",

        "Do not explain the answer.",

    ],

    inputs: [],

    context: [],

    expectedOutputs: [

        {

            id:
                "typescript-function",

            name:
                "TypeScript Function",

            description:
                "A TypeScript add function.",

            type:
                "TYPESCRIPT",

            required:
                true,

        },

    ],

    metadata: {},

};

console.log(
    "[TEST] backend:",
    backend.name,
);

console.log(
    "[TEST] model: qwen2.5-coder:7b",
);

const result =
    await backend.execute(
        task,
    );

console.log(
    "[TEST] status:",
    result.status,
);

console.log(
    "[TEST] executionId:",
    result.executionId,
);

if (
    result.error
) {

    console.error(
        "[TEST] error:",
        result.error,
    );

    process.exit(
        1,
    );

}

const output =
    result.outputs[0];

if (
    output?.kind === "INLINE"
) {

    console.log(
        "\n========== OLLAMA OUTPUT ==========\n",
    );

    console.log(
        output.content,
    );

}

if (
    result.status !==
    BackendStatus.SUCCEEDED
) {

    process.exit(
        1,
    );

}
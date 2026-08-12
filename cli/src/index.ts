#!/usr/bin/env node

import {
    DefaultPlatform,
} from "@engineering/platform";

import {
    CliCommand,
} from "./CliCommand.js";
import { CliRuntime } from "./CliRuntime.js";

function parseCommand(
    argumentsList: readonly string[],
): CliCommand {

    const [
        command,
        action,
        pipeline,
        inputFile,
    ] = argumentsList;

    if (
        command === "backend" &&
        action === "list"
    ) {

        return {
            kind: "BACKEND_LIST",
        };

    }

    if (
        command === "engine" &&
        action === "list"
    ) {

        return {
            kind: "ENGINE_LIST",
        };

    }

    if (
        command === "pipeline" &&
        action === "list"
    ) {

        return {
            kind: "PIPELINE_LIST",
        };

    }

    if (
        command === "execute" &&
        pipeline &&
        inputFile
    ) {

        return {

            kind: "EXECUTE",

            pipeline,

            inputFile,

        };

    }

    throw new Error(
        [
            "Unknown command.",
            "",
            "Usage:",
            "  engineering backend list",
            "  engineering engine list",
            "  engineering pipeline list",
            "  engineering execute <pipeline> <input-file>",
        ].join("\n"),
    );

}

async function main(): Promise<void> {

    const command =
        parseCommand(
            process.argv.slice(2),
        );

    const platform =
        await DefaultPlatform.create();

    const runtime =
        new CliRuntime(
            platform,
        );

    const output =
        await runtime.execute(
            command,
        );

    console.log(
        JSON.stringify(
            output,
            null,
            2,
        ),
    );

}

main().catch(
    error => {

        console.error(
            error instanceof Error
                ? error.message
                : error,
        );

        process.exitCode = 1;

    },
);
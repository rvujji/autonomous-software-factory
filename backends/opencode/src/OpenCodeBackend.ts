import {
    BackendConfiguration,
    BackendResult,
    BackendTask,
} from "@engineering/backend-shared";

import {
    CliBackend,
    CliProcess,
} from "@engineering/backend-cli";

import { randomUUID } from "node:crypto";

import { OpenCodeCommandBuilder } from "./OpenCodeCommandBuilder.js";
import { OpenCodeConfiguration } from "./OpenCodeConfiguration.js";
import { OpenCodeResultMapper } from "./OpenCodeResultMapper.js";

export class OpenCodeBackend
extends CliBackend {

    readonly name = "OpenCode";

    readonly version = "1.0.0";

    private readonly commandBuilder: OpenCodeCommandBuilder;

    private readonly resultMapper =
        new OpenCodeResultMapper();

    constructor(

        process: CliProcess,

        configuration: OpenCodeConfiguration,

    ) {

        super(process);

        this.commandBuilder =
            new OpenCodeCommandBuilder(
                configuration,
            );

    }

    override async execute(

        task: BackendTask,

        configuration?: BackendConfiguration,

    ): Promise<BackendResult> {

        const command =
            this.commandBuilder.build(
                task,
                configuration,
            );

        const result =
            await this.process.execute(
                command,
            );

        return this.resultMapper.map(

            randomUUID(),

            result,

        );

    }

}
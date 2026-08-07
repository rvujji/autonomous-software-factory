import { CliCommand } from "./CliCommand.js";
import { CliResult } from "./CliResult.js";

export interface CliProcess {

    execute(
        command: CliCommand,
    ): Promise<CliResult>;

}
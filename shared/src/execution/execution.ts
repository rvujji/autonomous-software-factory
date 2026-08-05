import { Artifact } from "../artifact/artifact.js";
import { Identifier } from "../foundation/index.js";
import { ExecutionMetadata } from "./execution-metadata.js";
import { ExecutionState } from "./execution-state.js";

export interface Execution {

    readonly id: Identifier;

    readonly pipeline: string;

    readonly state: ExecutionState;

    readonly artifacts: readonly Artifact[];

    readonly metadata: ExecutionMetadata;

}
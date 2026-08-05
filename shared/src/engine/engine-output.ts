import { Artifact } from "../artifact/artifact.js";

export interface EngineOutput {

    readonly artifacts?: readonly Artifact[];

    readonly data?: readonly unknown[];

}
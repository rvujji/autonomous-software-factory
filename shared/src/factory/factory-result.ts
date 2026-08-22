import {
    Artifact,
} from "../artifact/artifact.js";

export interface FactoryResult {

    readonly artifacts:
        readonly Artifact[];

}
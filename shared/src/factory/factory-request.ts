import {
    Artifact,
} from "../artifact/artifact.js";

export type FactoryRequest =
    | TopicFactoryRequest
    | ProjectFactoryRequest;

export interface TopicFactoryRequest {

    readonly kind:
        "TOPIC";

    readonly topic:
        string;

}

export interface ProjectFactoryRequest {

    readonly kind:
        "PROJECT";

    readonly artifacts:
        readonly Artifact[];

}
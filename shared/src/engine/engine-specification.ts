import { EngineType } from "./engine-type.js";
import { EngineMetadata } from "./engine-metadata.js";

export interface EngineSpecification {

    readonly name: string;

    readonly displayName: string;

    readonly type: EngineType;

    readonly metadata: EngineMetadata;

}
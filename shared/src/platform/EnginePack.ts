import { Engine } from "../engine/index.js";
import { Pipeline } from "../pipeline/index.js";

export interface EnginePack {

    readonly name: string;

    readonly version: string;

    readonly engines: readonly Engine[];

    readonly pipelines: readonly Pipeline[];

}
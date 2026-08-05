import { EngineInput } from "./engine-input.js";

export interface EngineRequest {

    readonly input: EngineInput;

    readonly configuration?: Readonly<Record<string, unknown>>;

}
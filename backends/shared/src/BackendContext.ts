import { BackendInputSource } from "./BackendInputSource.js";

export interface BackendContext {

    readonly id: string;

    readonly name: string;

    readonly source: BackendInputSource;

}
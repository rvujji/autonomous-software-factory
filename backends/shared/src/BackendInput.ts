import { BackendInputSource } from "./BackendInputSource.js";

export interface BackendInput {

    readonly id: string;

    readonly name: string;

    readonly description?: string;

    readonly type: string;

    readonly required: boolean;

    readonly source: BackendInputSource;

    readonly metadata: Readonly<Record<string, unknown>>;

}
export interface OpenCodeConfiguration {

    readonly executable: string;

    readonly arguments: readonly string[];

    readonly format?: "default" | "json";

}
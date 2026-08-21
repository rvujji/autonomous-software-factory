export interface Evidence {

    readonly id: string;

    readonly statement: string;

    readonly sourceArtifactId: string;

    readonly sourceName: string;

    readonly confidence:
        "LOW" |
        "MEDIUM" |
        "HIGH";

}
export interface KnowledgeFinding {

    readonly id: string;

    readonly sourceId: string;

    readonly statement: string;

    readonly evidence: string;

    readonly confidence:
        "HIGH" |
        "MEDIUM" |
        "LOW";

    readonly implications:
        readonly string[];

}
export type WorkKind =
    | "RESEARCH"
    | "ANALYSIS"
    | "PRODUCT_DEFINITION"
    | "REQUIREMENTS"
    | "ARCHITECTURE"
    | "PLANNING"
    | "IMPLEMENTATION"
    | "VERIFICATION"
    | "DOCUMENTATION";

export interface WorkItem {

    readonly id:
        string;

    readonly name:
        string;

    readonly kind:
        WorkKind;

    readonly objective:
        string;

    readonly required:
        boolean;

    readonly dependsOn:
        readonly string[];

}
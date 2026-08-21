export interface ResearchGap {

    readonly id: string;

    readonly question: string;

    readonly reason: string;

    readonly importance:
        "LOW" |
        "MEDIUM" |
        "HIGH" |
        "CRITICAL";

    readonly affectedFindingIds: readonly string[];

}
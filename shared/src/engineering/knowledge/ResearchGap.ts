export interface ResearchGap {

    readonly id: string;

    readonly topic: string;

    readonly description: string;

    readonly importance:
        "CRITICAL" |
        "HIGH" |
        "MEDIUM" |
        "LOW";

    readonly recommendedResearch:
        string;

}
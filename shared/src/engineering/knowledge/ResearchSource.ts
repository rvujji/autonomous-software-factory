export interface ResearchSource {

    readonly id: string;

    readonly title: string;

    readonly sourceType:
        "DOCUMENT" |
        "WEB" |
        "USER_INPUT" |
        "INTERVIEW" |
        "DATASET" |
        "OTHER";

    readonly location?: string;

    readonly description?: string;

    readonly collectedAt: string;

    readonly content?: string;

    readonly metadata:
        Readonly<Record<string, unknown>>;

}
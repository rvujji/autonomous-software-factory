export interface Decision {

    readonly id: string;

    readonly statement: string;

    readonly rationale: string;

    readonly alternatives?: readonly string[];

    readonly sourceFindingIds: readonly string[];

}
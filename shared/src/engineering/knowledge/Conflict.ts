export interface Conflict {

    readonly id: string;

    readonly statement: string;

    readonly sourceFindingIds: readonly string[];

    readonly resolutionRequired: boolean;

}
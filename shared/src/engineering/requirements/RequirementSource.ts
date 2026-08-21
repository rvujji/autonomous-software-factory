export interface RequirementSource {

    readonly artifactId: string;

    readonly artifactName: string;

    readonly findingIds: readonly string[];

    readonly rationale: string;

}
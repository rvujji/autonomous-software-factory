import { ArtifactReference } from "../artifact/artifact-reference.js";

export interface Plan {

    readonly name: string;

    readonly version: string;

    readonly objective: string;

    readonly inputs: readonly ArtifactReference[];

    readonly steps: readonly PlanStep[];

    readonly dependencies: readonly PlanDependency[];

    readonly expectedArtifacts: readonly PlanArtifact[];

    readonly constraints: readonly string[];

}

export interface PlanStep {

    readonly id: string;

    readonly name: string;

    readonly objective: string;

}

export interface PlanDependency {

    readonly step: string;

    readonly dependsOn: string;

}

export interface PlanArtifact {

    readonly name: string;

    readonly type: string;

}
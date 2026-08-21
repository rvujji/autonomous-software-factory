import { Assumption } from "./Assumption.js";
import { Constraint } from "./Constraint.js";
import { Requirement } from "./Requirement.js";
import { RequirementSource } from "./RequirementSource.js";

export interface RequirementSet {

    readonly projectName: string;

    readonly version: string;

    readonly functionalRequirements:
        readonly Requirement[];

    readonly nonFunctionalRequirements:
        readonly Requirement[];

    readonly constraints:
        readonly Constraint[];

    readonly assumptions:
        readonly Assumption[];

    readonly sources:
        readonly RequirementSource[];

}
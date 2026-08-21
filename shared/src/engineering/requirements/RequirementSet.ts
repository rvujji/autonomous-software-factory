import { Assumption } from "./Assumption.js";
import { Constraint } from "./Constraint.js";
import { RequirementCandidate } from "./RequirementCandidate.js";
import { Requirement } from "./Requirement.js";

export interface RequirementSet {

    readonly projectName: string;

    readonly version: string;

    readonly functionalRequirements:
        readonly Requirement[];

    readonly nonFunctionalRequirements:
        readonly Requirement[];

    readonly candidates:
        readonly RequirementCandidate[];

    readonly constraints:
        readonly Constraint[];

    readonly assumptions:
        readonly Assumption[];

}
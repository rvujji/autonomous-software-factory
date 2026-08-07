import { Assumption } from "./Assumption.js";
import { Constraint } from "./Constraint.js";
import { Requirement } from "./Requirement.js";

export interface Requirements {

    readonly projectName: string;

    readonly version: string;

    readonly functionalRequirements: readonly Requirement[];

    readonly nonFunctionalRequirements: readonly Requirement[];

    readonly constraints: readonly Constraint[];

    readonly assumptions: readonly Assumption[];

}
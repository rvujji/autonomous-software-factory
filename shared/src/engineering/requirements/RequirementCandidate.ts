import { RequirementPriority } from "./RequirementPriority.js";
import { RequirementProvenance } from "./RequirementProvenance.js";
import { RequirementType } from "./RequirementType.js";

export interface RequirementCandidate {

    readonly id: string;

    readonly title: string;

    readonly description: string;

    readonly type: RequirementType;

    readonly priority: RequirementPriority;

    readonly rationale: string;

    readonly provenance:
        RequirementProvenance;

    /**
     * Indicates whether the candidate was directly
     * supported by evidence or inferred by the system.
     */
    readonly confidence:
        "HIGH" |
        "MEDIUM" |
        "LOW";

}
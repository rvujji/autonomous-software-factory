import { AcceptanceCriterion } from "./AcceptanceCriterion.js";
import { RequirementPriority } from "./RequirementPriority.js";
import { RequirementProvenance } from "./RequirementProvenance.js";
import { RequirementStatus } from "./RequirementStatus.js";
import { RequirementType } from "./RequirementType.js";

export interface Requirement {

    readonly id: string;

    readonly title: string;

    readonly description: string;

    readonly type: RequirementType;

    readonly priority: RequirementPriority;

    readonly status: RequirementStatus;

    readonly acceptanceCriteria:
        readonly AcceptanceCriterion[];

    /**
     * Evidence and reasoning that support the requirement.
     */
    readonly provenance?:
        RequirementProvenance;

}
export interface RequirementProvenance {

    /**
     * Identifies where the requirement originated.
     *
     * Examples:
     * - RESEARCH
     * - USER_INPUT
     * - EXISTING_REQUIREMENT
     * - BUSINESS_DECISION
     * - SYSTEM_INFERENCE
     */
    readonly sourceType: string;

    /**
     * References the artifact that supports this requirement.
     */
    readonly sourceArtifactIds: readonly string[];

    /**
     * Optional human-readable explanation of how
     * the evidence supports the requirement.
     */
    readonly rationale?: string;

}
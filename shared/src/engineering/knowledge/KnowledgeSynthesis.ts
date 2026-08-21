import { Conflict } from "./Conflict.js";
import { Decision } from "./Decision.js";
import { Finding } from "./Finding.js";
import { ResearchGap } from "./ResearchGap.js";

export interface KnowledgeSynthesis {

    readonly projectName: string;

    readonly version: string;

    readonly findings: readonly Finding[];

    readonly decisions: readonly Decision[];

    readonly gaps: readonly ResearchGap[];

    readonly conflicts: readonly Conflict[];

}
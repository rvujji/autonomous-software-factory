import { Evidence } from "./Evidence.js";
import { KnowledgeType } from "./KnowledgeType.js";

export interface Finding {

    readonly id: string;

    readonly type: KnowledgeType;

    readonly statement: string;

    readonly implication?: string;

    readonly evidence: readonly Evidence[];

    readonly confidence:
        "LOW" |
        "MEDIUM" |
        "HIGH";

}
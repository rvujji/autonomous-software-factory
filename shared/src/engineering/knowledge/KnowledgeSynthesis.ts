import { KnowledgeFinding } from "./KnowledgeFinding.js";

export interface KnowledgeSynthesis {

    readonly id: string;

    readonly topic: string;

    readonly summary: string;

    readonly findings:
        readonly KnowledgeFinding[];

    readonly conclusions:
        readonly string[];

    readonly uncertainties:
        readonly string[];

    readonly recommendations:
        readonly string[];

}
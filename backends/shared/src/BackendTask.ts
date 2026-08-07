import { BackendContext } from "./BackendContext.js";
import { BackendInput } from "./BackendInput.js";
import { BackendOutput } from "./BackendOutput.js";
import { SkillReference } from "./SkillReference.js";
import { TemplateReference } from "./TemplateReference.js";

export interface BackendTask {

    readonly contractVersion: string;

    readonly id: string;

    readonly name: string;

    readonly description?: string;

    readonly objective: string;

    readonly instructions: readonly string[];

    readonly skill?: SkillReference;

    readonly template?: TemplateReference;

    readonly inputs: readonly BackendInput[];

    readonly context: readonly BackendContext[];

    readonly expectedOutputs: readonly BackendOutput[];

    readonly metadata: Readonly<Record<string, unknown>>;

}
import { Engine } from "../../../shared/src/engine/index.js";
import { Pipeline } from "../../../shared/src/pipeline/index.js";
import { EnginePack } from "../../../shared/src/platform/EnginePack.js";

import { ParseRequirementsEngine } from "./requirements/ParseRequirementsEngine.js";

export class EngineeringEnginePack implements EnginePack{

    readonly name =
        "engineering";

    readonly version =
        "1.0.0";

    readonly engines:
        readonly Engine[] = [

        new ParseRequirementsEngine(),

    ];

    readonly pipelines:
        readonly Pipeline[] = [

    ];

}
import { Engine } from "@engineering/shared/engine";
import { Pipeline } from "@engineering/shared/pipeline";
import { EnginePack } from "@engineering/shared/platform";

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
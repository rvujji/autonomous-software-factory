import {
    Engine,
} from "@engineering/shared/engine";

import {
    Pipeline,
} from "@engineering/shared/pipeline";

import {
    EnginePack,
} from "@engineering/shared/platform";

import {
    BackendRuntime,
} from "@engineering/core/backend";

import {
    ArtifactRuntime,
} from "@engineering/core/artifact";

import {
    EngineRuntime,
} from "@engineering/core/engine";

import {
    ParseRequirementsEngine,
} from "./requirements/ParseRequirementsEngine.js";

import {
    ValidateRequirementsEngine,
} from "./requirements/ValidateRequirementsEngine.js";

import {
    EngineeringPipeline,
} from "./pipeline/EngineeringPipeline.js";
import {
    RepairRequirementsEngine,
} from "./requirements/RepairRequirementsEngine.js";
import {
    PlanRequirementsEngine,
} from "./requirements/PlanRequirementsEngine.js";

export class EngineeringEnginePack
implements EnginePack {

    readonly name =
        "engineering";

    readonly version =
        "1.0.0";

    readonly engines:
        readonly Engine[];

    readonly pipelines:
        readonly Pipeline[];

    constructor(

        backends:
            BackendRuntime,

        engines:
            EngineRuntime,

        artifacts:
            ArtifactRuntime,

    ) {

        this.engines = [

            new ParseRequirementsEngine(
                backends,
            ),

            new ValidateRequirementsEngine(),
            new RepairRequirementsEngine(
                backends,
            ),
            new PlanRequirementsEngine(),

        ];

        this.pipelines = [

            new EngineeringPipeline(

                engines,

                artifacts,

            ),

        ];

    }

}
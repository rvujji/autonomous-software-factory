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
    ValidateRequirementsEngine,
    RepairRequirementsEngine,
    PlanRequirementsEngine,
    BuildRequirementsGraphEngine,
    GenerateRequirementsDocumentEngine,
    ExtractKnowledgeEngine,
    SynthesizeKnowledgeEngine,
    RefineRequirementsEngine,
    ValidateRequirementSetEngine,
} from "./requirements/index.js";

import {
    EngineeringPipeline,
} from "./pipeline/EngineeringPipeline.js";

import {
    RequirementsRefinementPipeline,
} from "./pipeline/RequirementsRefinementPipeline.js";
import {
    WorkDiscoveryEngine,
} from "./work/index.js";

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

            //
            // Existing requirements flow
            //

            new ParseRequirementsEngine(
                backends,
            ),

            new ValidateRequirementsEngine(),

            new RepairRequirementsEngine(
                backends,
            ),

            new PlanRequirementsEngine(),

            new BuildRequirementsGraphEngine(),

            new GenerateRequirementsDocumentEngine(),

            //
            // Knowledge → Requirements refinement
            //

            new ExtractKnowledgeEngine(
                backends,
            ),

            new SynthesizeKnowledgeEngine(
                backends,
            ),

            new RefineRequirementsEngine(
                backends,
            ),

            new ValidateRequirementSetEngine(),

            new WorkDiscoveryEngine(),

        ];

        this.pipelines = [

            new EngineeringPipeline(

                engines,

                artifacts,

            ),

            new RequirementsRefinementPipeline(

                engines,

                artifacts,

            ),

        ];

    }

}
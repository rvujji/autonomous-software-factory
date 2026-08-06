import { ArtifactRuntime } from "@engineering/core/artifact";
import { EngineRuntime } from "@engineering/core/engine";
import { PipelineRuntime } from "@engineering/core/pipeline";
import { ExecutionRuntime } from "@engineering/core/execution";

export interface Platform {

    readonly artifacts: ArtifactRuntime;

    readonly engines: EngineRuntime;

    readonly pipelines: PipelineRuntime;

    readonly executions: ExecutionRuntime;

}
import { ArtifactRuntime } from "@engineering/core/artifact";
import { BackendRuntime } from "@engineering/core/backend";
import { EngineRuntime } from "@engineering/core/engine";
import { ExecutionRuntime } from "@engineering/core/execution";
import { PipelineRuntime } from "@engineering/core/pipeline";

export interface Platform {

    readonly artifacts: ArtifactRuntime;

    readonly backends: BackendRuntime;

    readonly engines: EngineRuntime;

    readonly pipelines: PipelineRuntime;

    readonly executions: ExecutionRuntime;

}
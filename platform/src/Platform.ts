import { ArtifactRuntime } from "../../core/src/runtime/artifact/ArtifactRuntime.js";
import { EngineRuntime } from "../../core/src/runtime/engine/EngineRuntime.js";
import { PipelineRuntime } from "../../core/src/runtime/pipeline/PipelineRuntime.js";
import { ExecutionRuntime } from "../../core/src/runtime/execution/ExecutionRuntime.js";

export interface Platform {

    readonly artifacts: ArtifactRuntime;

    readonly engines: EngineRuntime;

    readonly pipelines: PipelineRuntime;

    readonly executions: ExecutionRuntime;

}
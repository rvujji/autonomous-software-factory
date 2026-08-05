import { EngineContext } from "./engine-context.js";
import { EngineRequest } from "./engine-request.js";
import { EngineResult } from "./engine-result.js";
import { EngineSpecification } from "./engine-specification.js";

export interface Engine {

    readonly specification: EngineSpecification;

    execute(
        context: EngineContext,
        request: EngineRequest,
    ): Promise<EngineResult>;

}
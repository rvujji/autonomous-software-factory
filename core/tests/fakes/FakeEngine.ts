import {
    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
    EngineSpecification,
} from "../../../shared/src/engine/index.js";

export class FakeEngine implements Engine {

    readonly specification: EngineSpecification = {

        name: "fake",

        displayName: "Fake Engine",

        type: "GENERATOR",

        metadata: {
            version: "1.0.0",
        },

    };

    async execute(
        context: EngineContext,
        request: EngineRequest,
    ): Promise<EngineResult> {

        return {

            output: {

                artifacts: request.input.artifacts,

            },

        };

    }

}
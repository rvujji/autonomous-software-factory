import {

    Artifact,
    ArtifactState,

} from "../../../../shared/src/artifact/index.js";

import {

    Engine,
    EngineContext,
    EngineRequest,
    EngineResult,
    EngineSpecification,
    EngineType,

} from "../../../../shared/src/engine/index.js";

export class ParseRequirementsEngine
implements Engine {

    readonly specification: EngineSpecification = {

        name: "engineering.parse-requirements",

        displayName: "Parse Requirements",

        type: "PARSER" as EngineType,

        metadata: {

            version: "1.0.0",

        },

    };

    async execute(

        context: EngineContext,

        request: EngineRequest,

    ): Promise<EngineResult> {

        const artifact: Artifact = {

            id: "requirements",

            name: "Parsed Requirements",

            type: "REQUIREMENTS",

            version: 1,

            state: "CREATED" as ArtifactState,

            metadata: {

                createdAt: new Date(),

            },

            parents: request.input.artifacts,

            payload: {

                parsed: true,

            },

        };

        return {

            output: {

                artifacts: [

                    artifact,

                ],

            },

        };

    }

}
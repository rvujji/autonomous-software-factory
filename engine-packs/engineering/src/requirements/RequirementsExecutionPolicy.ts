import {
    BackendExecutionCandidate,
} from "@engineering/backend-shared";

export class RequirementsExecutionPolicy {

    static candidates(): readonly BackendExecutionCandidate[] {

        return [

            {
                backend:
                    "OpenCode",

                model:
                    "opencode/big-pickle",
            },

            {
                backend:
                    "OpenCode",

                model:
                    "opencode/hy3-free",
            },

            {
                backend:
                    "OpenCode",

                model:
                    "opencode/mimo-v2.5-free",
            },

            {
                backend:
                    "OpenCode",

                model:
                    "opencode/muse-spark-1.2-contributor-free",
            },

            {
                backend:
                    "OpenCode",

                model:
                    "opencode/nemotron-3-ultra-free",
            },

            {
                backend:
                    "OpenCode",

                model:
                    "opencode/nemotron-3.5-lightning-free",
            },

            {
                backend:
                    "OpenCode",

                model:
                    "opencode/x-preview-f-free",
            },

        ];

    }

}
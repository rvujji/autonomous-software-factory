export type CliCommand =

    | {

        readonly kind: "BACKEND_LIST";

    }

    | {

        readonly kind: "ENGINE_LIST";

    }

    | {

        readonly kind: "PIPELINE_LIST";

    }

    | {

        readonly kind: "EXECUTE";

        readonly pipeline: string;

        readonly inputFile: string;

    };
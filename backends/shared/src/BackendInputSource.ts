export type BackendInputSource =

    | {

        readonly kind: "CONTENT";

        readonly content: unknown;

    }

    | {

        readonly kind: "FILE";

        readonly path: string;

    }

    | {

        readonly kind: "ARTIFACT";

        readonly artifactId: string;

    }

    | {

        readonly kind: "REPOSITORY";

        readonly url: string;

        readonly revision?: string;

    };
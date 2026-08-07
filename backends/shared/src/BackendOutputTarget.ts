export type BackendOutputTarget =

    | {

        readonly kind: "INLINE";

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

        readonly kind: "PATCH";

        readonly patch: string;

    };
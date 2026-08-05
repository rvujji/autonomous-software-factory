import { Identifier } from "../foundation/identifier.js";

import { Artifact } from "./artifact.js";
import { ArtifactFilter } from "./artifact-filter.js";
import { ArtifactQuery } from "./artifact-query.js";
import { ArtifactSort } from "./artifact-sort.js";

export interface ArtifactStore {

    store(
        artifact: Artifact
    ): Promise<void>;

    get(
        id: Identifier
    ): Promise<Artifact | undefined>;

    find(
        query?: ArtifactQuery,
        filter?: ArtifactFilter,
        sort?: ArtifactSort
    ): Promise<readonly Artifact[]>;

    exists(
        id: Identifier
    ): Promise<boolean>;

    archive(
        id: Identifier
    ): Promise<void>;
}
export enum ArtifactSortField {

    NAME = "name",

    TYPE = "type",

    CREATED_AT = "createdAt",

    VERSION = "version"
}

export enum SortDirection {

    ASC = "ASC",

    DESC = "DESC"
}

export interface ArtifactSort {

    readonly field: ArtifactSortField;

    readonly direction: SortDirection;
}
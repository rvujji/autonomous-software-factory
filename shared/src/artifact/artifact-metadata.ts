import { Metadata } from "../foundation/metadata.js";

export interface ArtifactMetadata extends Metadata {

    readonly checksum?: string;

    readonly size?: number;

    readonly mimeType?: string;

    readonly encoding?: string;

}
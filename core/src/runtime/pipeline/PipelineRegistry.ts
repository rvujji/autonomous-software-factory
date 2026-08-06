import { Pipeline } from "@engineering/shared/pipeline";

export interface PipelineRegistry {

    register(
        pipeline: Pipeline,
    ): Promise<void>;

    unregister(
        name: string,
    ): Promise<void>;

    get(
        name: string,
    ): Promise<Pipeline | undefined>;

    exists(
        name: string,
    ): Promise<boolean>;

    list(): Promise<readonly Pipeline[]>;

}
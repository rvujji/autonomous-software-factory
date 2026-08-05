import { Pipeline } from "../../../../shared/src/pipeline/index.js";
import { PipelineRegistry } from "./PipelineRegistry.js";

export class InMemoryPipelineRegistry implements PipelineRegistry {

    private readonly pipelines = new Map<string, Pipeline>();

    async register(
        pipeline: Pipeline,
    ): Promise<void> {

        const name = pipeline.specification.name;

        if (this.pipelines.has(name)) {
            throw new Error(
                `Pipeline '${name}' is already registered.`,
            );
        }

        this.pipelines.set(name, pipeline);

    }

    async unregister(
        name: string,
    ): Promise<void> {

        this.pipelines.delete(name);

    }

    async get(
        name: string,
    ): Promise<Pipeline | undefined> {

        return this.pipelines.get(name);

    }

    async exists(
        name: string,
    ): Promise<boolean> {

        return this.pipelines.has(name);

    }

    async list(): Promise<readonly Pipeline[]> {

        return [...this.pipelines.values()];

    }

}
import { describe, expect, it } from "vitest";

import { InMemoryPipelineRegistry } from "../../src/runtime/pipeline/InMemoryPipelineRegistry.js";
import { FakePipeline } from "../fakes/FakePipeline.js";

describe("InMemoryPipelineRegistry", () => {

    it("registers a pipeline", async () => {

        const registry = new InMemoryPipelineRegistry();

        const pipeline = new FakePipeline();

        await registry.register(pipeline);

        expect(
            await registry.exists("fake"),
        ).toBe(true);

    });

    it("retrieves a registered pipeline", async () => {

        const registry = new InMemoryPipelineRegistry();

        const pipeline = new FakePipeline();

        await registry.register(pipeline);

        const result = await registry.get("fake");

        expect(result).toBe(pipeline);

    });

    it("returns undefined for an unknown pipeline", async () => {

        const registry = new InMemoryPipelineRegistry();

        expect(
            await registry.get("unknown"),
        ).toBeUndefined();

    });

    it("lists registered pipelines", async () => {

        const registry = new InMemoryPipelineRegistry();

        await registry.register(new FakePipeline());

        expect(
            await registry.list(),
        ).toHaveLength(1);

    });

    it("unregisters a pipeline", async () => {

        const registry = new InMemoryPipelineRegistry();

        await registry.register(new FakePipeline());

        await registry.unregister("fake");

        expect(
            await registry.exists("fake"),
        ).toBe(false);

    });

    it("throws on duplicate registration", async () => {

        const registry = new InMemoryPipelineRegistry();

        await registry.register(new FakePipeline());

        await expect(
            registry.register(new FakePipeline()),
        ).rejects.toThrow();

    });

});
import { describe, expect, it } from "vitest";

import { InMemoryEngineRegistry }
    from "../../src/runtime/engine/InMemoryEngineRegistry.js";

import { FakeEngine }
    from "../fakes/FakeEngine.js";

describe("InMemoryEngineRegistry", () => {

    it("registers an engine", async () => {

        const registry =
            new InMemoryEngineRegistry();

        const engine =
            new FakeEngine();

        await registry.register(
            engine,
        );

        expect(
            await registry.exists("fake"),
        ).toBe(true);

    });

    it("retrieves a registered engine", async () => {

        const registry =
            new InMemoryEngineRegistry();

        const engine =
            new FakeEngine();

        await registry.register(
            engine,
        );

        const result =
            await registry.get("fake");

        expect(result)
            .toBe(engine);

    });

    it("returns undefined for unknown engine", async () => {

        const registry =
            new InMemoryEngineRegistry();

        expect(
            await registry.get("unknown"),
        ).toBeUndefined();

    });

    it("lists registered engines", async () => {

        const registry =
            new InMemoryEngineRegistry();

        await registry.register(
            new FakeEngine(),
        );

        expect(
            await registry.list(),
        ).toHaveLength(1);

    });

    it("unregisters an engine", async () => {

        const registry =
            new InMemoryEngineRegistry();

        await registry.register(
            new FakeEngine(),
        );

        await registry.unregister(
            "fake",
        );

        expect(
            await registry.exists("fake"),
        ).toBe(false);

    });

    it("throws on duplicate registration", async () => {

        const registry =
            new InMemoryEngineRegistry();

        await registry.register(
            new FakeEngine(),
        );

        await expect(

            registry.register(
                new FakeEngine(),
            ),

        ).rejects.toThrow();

    });

});
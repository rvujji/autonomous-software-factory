import { describe, expect, it } from "vitest";

import { InMemoryArtifactStore } from "../../src/runtime/artifact/InMemoryArtifactStore.js";

import {
    Artifact,
    ArtifactState,
} from "../../../shared/src/artifact/index.js";

function createArtifact(id: string): Artifact {

    return {

        id,

        name: "Test Artifact",

        type: "specification",

        version: 1,

        state: ArtifactState.CREATED,

        metadata: {

            createdAt: new Date("2026-01-01T00:00:00Z"),

        },

        parents: [],

        payload: {},

    };

}

describe("InMemoryArtifactStore", () => {

    it("creates an empty store", () => {

        const store = new InMemoryArtifactStore();

        expect(store).toBeDefined();

    });

    it("stores an artifact", async () => {

        const store = new InMemoryArtifactStore();

        const artifact = createArtifact("artifact-1");

        await store.store(artifact);

        expect(
            await store.exists("artifact-1"),
        ).toBe(true);

    });

    it("retrieves a stored artifact", async () => {

        const store = new InMemoryArtifactStore();

        const artifact = createArtifact("artifact-1");

        await store.store(artifact);

        const loaded = await store.get("artifact-1");

        expect(loaded).toEqual(artifact);

    });

    it("returns undefined for an unknown artifact", async () => {

        const store = new InMemoryArtifactStore();

        const loaded = await store.get("missing");

        expect(loaded).toBeUndefined();

    });

    it("returns true when an artifact exists", async () => {

        const store = new InMemoryArtifactStore();

        await store.store(
            createArtifact("artifact-1"),
        );

        expect(
            await store.exists("artifact-1"),
        ).toBe(true);

    });

    it("returns false when an artifact does not exist", async () => {

        const store = new InMemoryArtifactStore();

        expect(
            await store.exists("missing"),
        ).toBe(false);

    });

    it("throws when storing a duplicate artifact", async () => {

        const store = new InMemoryArtifactStore();

        const artifact = createArtifact("artifact-1");

        await store.store(artifact);

        await expect(
            store.store(artifact),
        ).rejects.toThrow();

    });

    it("returns all stored artifacts", async () => {

        const store = new InMemoryArtifactStore();

        await store.store(
            createArtifact("artifact-1"),
        );

        await store.store(
            createArtifact("artifact-2"),
        );

        await store.store(
            createArtifact("artifact-3"),
        );

        const artifacts = await store.find();

        expect(artifacts).toHaveLength(3);

        expect(artifacts[0]!.id).toBe("artifact-1");
        expect(artifacts[1]!.id).toBe("artifact-2");
        expect(artifacts[2]!.id).toBe("artifact-3");

    });

});
import { describe, expect, it } from "vitest";

import { ArtifactRuntime } from "../../src/runtime/artifact/ArtifactRuntime.js";
import { InMemoryArtifactStore } from "../../src/runtime/artifact/InMemoryArtifactStore.js";

import { FakeClock } from "../fakes/FakeClock.js";
import { FakeIdentifierGenerator } from "../fakes/FakeIdentifierGenerator.js";

describe("ArtifactRuntime", () => {

    it("creates an artifact", async () => {

        const runtime = new ArtifactRuntime(

            new InMemoryArtifactStore(),

            new FakeIdentifierGenerator(),

            new FakeClock()

        );

        const artifact = await runtime.create({

            name: "Specification",

            type: "specification",

            payload: "# Hello"

        });

        expect(artifact.id)
            .toBe("artifact-001");

        expect(artifact.version)
            .toBe(1);

        expect(artifact.name)
            .toBe("Specification");

    });

});
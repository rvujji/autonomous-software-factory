import { describe, expect, it } from "vitest";

import { DefaultPlatform } from "../src/DefaultPlatform.js";

describe("DefaultPlatform", () => {

    it("creates a platform", async () => {

        const platform =
            await DefaultPlatform.create();

        expect(platform.artifacts).toBeDefined();
        expect(platform.engines).toBeDefined();
        expect(platform.pipelines).toBeDefined();
        expect(platform.executions).toBeDefined();

    });

});
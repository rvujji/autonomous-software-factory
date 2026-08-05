import { IdentifierGenerator } from "../../src/runtime/foundation/IdentifierGenerator.js";

export class FakeIdentifierGenerator
implements IdentifierGenerator {

    async generate(): Promise<string> {

        return "artifact-001";

    }

}
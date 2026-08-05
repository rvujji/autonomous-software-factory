import { randomUUID } from "crypto";

import { Identifier } from "../../../../shared/src/foundation/index.js";
import { IdentifierGenerator } from "./IdentifierGenerator.js";

export class UuidIdentifierGenerator implements IdentifierGenerator {

    async generate(): Promise<Identifier> {
        return randomUUID();
    }

}
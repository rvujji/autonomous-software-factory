import { randomUUID } from "crypto";

import { Identifier } from "@engineering/shared/foundation";
import { IdentifierGenerator } from "./IdentifierGenerator.js";

export class UuidIdentifierGenerator implements IdentifierGenerator {

    async generate(): Promise<Identifier> {
        return randomUUID();
    }

}
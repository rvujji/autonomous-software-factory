import { Identifier } from "../../../../shared/src/foundation/index.js";

export interface IdentifierGenerator {

    generate(): Promise<Identifier>;

}
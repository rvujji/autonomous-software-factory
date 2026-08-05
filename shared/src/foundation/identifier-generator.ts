import { Identifier } from "./identifier.js";

export interface IdentifierGenerator {

    generate(): Promise<Identifier>;

}
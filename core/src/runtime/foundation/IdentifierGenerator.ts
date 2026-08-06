import { Identifier } from "@engineering/shared/foundation";

export interface IdentifierGenerator {

    generate(): Promise<Identifier>;

}
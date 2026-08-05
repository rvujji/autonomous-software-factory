import { Timestamp } from "../../../../shared/src/foundation/timestamp.js";

export interface Clock {

    now(): Timestamp;

}
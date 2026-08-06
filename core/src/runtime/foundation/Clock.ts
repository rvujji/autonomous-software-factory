import { Timestamp } from "@engineering/shared/foundation";

export interface Clock {

    now(): Timestamp;

}
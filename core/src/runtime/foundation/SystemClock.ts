import { Timestamp } from "@engineering/shared/foundation";
import { Clock } from "./Clock.js";

export class SystemClock implements Clock {

    now(): Timestamp {
        return new Date();
    }

}
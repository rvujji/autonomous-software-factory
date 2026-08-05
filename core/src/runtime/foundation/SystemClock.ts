import { Timestamp } from "../../../../shared/src/foundation/index.js";
import { Clock } from "./Clock.js";

export class SystemClock implements Clock {

    now(): Timestamp {
        return new Date();
    }

}
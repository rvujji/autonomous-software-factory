import { Clock } from "../../src/runtime/foundation/Clock.js";

export class FakeClock
implements Clock {

    now(): Date {

        return new Date(
            "2026-01-01T00:00:00Z"
        );

    }

}
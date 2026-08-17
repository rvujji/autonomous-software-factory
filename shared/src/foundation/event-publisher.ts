import { RuntimeEvent } from "./runtime-event.js";

export interface EventPublisher {

    publish(
        event: RuntimeEvent,
    ): void;

}
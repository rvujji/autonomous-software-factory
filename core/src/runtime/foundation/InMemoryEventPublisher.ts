import {
    EventPublisher,
    RuntimeEvent,
} from "@engineering/shared/foundation";

export class InMemoryEventPublisher
implements EventPublisher {

    private readonly events: RuntimeEvent[] = [];

    publish(
        event: RuntimeEvent,
    ): void {

        this.events.push(
            event,
        );

    }

    list(): readonly RuntimeEvent[] {

        return [
            ...this.events,
        ];

    }

}
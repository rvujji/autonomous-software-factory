import { Identifier } from "./identifier.js";
import { Timestamp } from "./timestamp.js";
import { RuntimeEventType } from "./runtime-event-type.js";

export interface RuntimeEvent {

    readonly type: RuntimeEventType;

    readonly timestamp: Timestamp;

    readonly component: string;

    readonly executionId?: Identifier;

    readonly data?: unknown;

}
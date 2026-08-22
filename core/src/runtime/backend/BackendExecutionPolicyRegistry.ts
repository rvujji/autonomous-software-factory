import {
    BackendExecutionPolicy,
} from "./BackendExecutionPolicy.js";

export interface BackendExecutionPolicyRegistry {

    register(
        policy: BackendExecutionPolicy,
    ): Promise<void>;

    unregister(
        name: string,
    ): Promise<void>;

    get(
        name: string,
    ): Promise<BackendExecutionPolicy | undefined>;

    has(
        name: string,
    ): Promise<boolean>;

    list(): Promise<readonly BackendExecutionPolicy[]>;

}
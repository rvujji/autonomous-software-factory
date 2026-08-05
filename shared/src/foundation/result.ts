import { ErrorInfo } from "./error.js";

export interface Result<T> {

    readonly success: boolean;

    readonly value?: T;

    readonly error?: ErrorInfo;
}
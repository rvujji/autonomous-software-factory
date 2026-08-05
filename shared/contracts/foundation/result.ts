import { ErrorInfo } from "./error";

export interface Result<T> {

    readonly success: boolean;

    readonly value?: T;

    readonly error?: ErrorInfo;
}
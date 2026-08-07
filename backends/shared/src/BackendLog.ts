export interface BackendLog {

    readonly timestamp: Date;

    readonly level: "DEBUG" | "INFO" | "WARN" | "ERROR";

    readonly message: string;

}
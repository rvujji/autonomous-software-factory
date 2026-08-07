export interface BackendOutput {

    readonly id: string;

    readonly name: string;

    readonly description?: string;

    readonly type: string;

    readonly required: boolean;

    readonly schema?: string;

}
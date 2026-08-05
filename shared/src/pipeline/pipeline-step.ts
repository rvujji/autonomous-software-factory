export interface PipelineStep {

    readonly engine: string;

    readonly configuration?: Readonly<Record<string, unknown>>;

}
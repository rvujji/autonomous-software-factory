export interface BackendMetrics {

    readonly startedAt: Date;

    readonly completedAt: Date;

    readonly durationMs: number;

    readonly inputSize?: number;

    readonly outputSize?: number;

    readonly tokenCount?: number;

    readonly estimatedCost?: number;

}
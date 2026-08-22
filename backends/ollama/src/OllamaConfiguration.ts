export interface OllamaConfiguration {

    readonly executable: string;

    readonly arguments: readonly string[];

    /**
     * Default Ollama model used when the execution
     * candidate does not specify one.
     */
    readonly model?: string;

}
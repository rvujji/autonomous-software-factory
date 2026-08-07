export interface CliCommand {
    readonly executable: string;
    readonly arguments: readonly string[];
    readonly workingDirectory?: string;
    readonly environment?: Readonly<Record<string, string>>;
    readonly standardInput?: string;
}
//# sourceMappingURL=CliCommand.d.ts.map
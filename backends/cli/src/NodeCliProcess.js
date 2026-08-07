import { spawn } from "node:child_process";
export class NodeCliProcess {
    async execute(command) {
        return new Promise((resolve, reject) => {
            const child = spawn(command.executable, [...command.arguments], {
                cwd: command.workingDirectory,
                env: {
                    ...process.env,
                    ...command.environment,
                },
                shell: false,
            });
            let standardOutput = "";
            let standardError = "";
            child.stdout.on("data", data => {
                standardOutput += data.toString();
            });
            child.stderr.on("data", data => {
                standardError += data.toString();
            });
            child.on("error", reject);
            child.on("close", exitCode => {
                resolve({
                    exitCode: exitCode ?? -1,
                    standardOutput,
                    standardError,
                });
            });
            if (command.standardInput) {
                child.stdin.write(command.standardInput);
            }
            child.stdin.end();
        });
    }
}
//# sourceMappingURL=NodeCliProcess.js.map
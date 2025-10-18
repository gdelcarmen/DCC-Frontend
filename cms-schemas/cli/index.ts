/* eslint-disable no-console */

const [, , command = "help", ...restArgs] = process.argv;
const wantsJson = restArgs.includes("--json");

const emit = (message: string, payload?: Record<string, unknown>) => {
  if (wantsJson) {
    console.log(
      JSON.stringify({
        command,
        status: "pending",
        ...payload
      })
    );
  } else {
    console.log(message);
  }
};

switch (command) {
  case "validate":
    emit("Schema validation placeholder. Implement cms-schemas/cli/index.ts validate.");
    process.exit(0);
    break;
  case "typegen":
    emit("Type generation placeholder. Implement cms-schemas/cli/index.ts typegen.");
    process.exit(0);
    break;
  case "seed":
    emit("Seed placeholder. Implement cms-schemas/cli/index.ts seed.");
    process.exit(0);
    break;
  case "export":
    emit("Export placeholder. Implement cms-schemas/cli/index.ts export.");
    process.exit(0);
    break;
default:
    emit(
      "Usage: pnpm --filter cms-schemas <validate|typegen|seed|export> [--json]",
      { command }
    );
    process.exit(command === "help" ? 0 : 1);
}

export {};

/* eslint-disable no-console */

const wantsJson = process.argv.includes("--json");

const payload = {
  schemaCount: 6,
  lastValidation: null,
  note: "Status checks not yet implemented."
};

if (wantsJson) {
  console.log(JSON.stringify(payload));
} else {
  console.log("cms-schemas status (placeholder)");
  console.log(`- schemaCount: ${payload.schemaCount}`);
  console.log(`- lastValidation: ${payload.lastValidation ?? "n/a"}`);
}

process.exit(0);

export {};

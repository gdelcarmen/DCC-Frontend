/* eslint-disable no-console */

const wantsJson = process.argv.includes("--json");

const payload = {
  bundleSize: null,
  axeViolations: [],
  note: "Analysis pipeline pending implementation."
};

if (wantsJson) {
  console.log(JSON.stringify(payload));
} else {
  console.log("ui-library analyze (placeholder)");
  console.log("- bundleSize: pending");
  console.log("- axeViolations: none (not yet evaluated)");
}

process.exit(0);

export {};

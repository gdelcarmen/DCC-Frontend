/* eslint-disable no-console */

const wantsJson = process.argv.includes("--json");

const payload = {
  apiRoutes: "pending",
  sitemap: "pending",
  lastISR: null,
  note: "Observability checks not yet implemented."
};

if (wantsJson) {
  console.log(JSON.stringify(payload));
} else {
  console.log("web-app status (placeholder)");
  console.log(`- apiRoutes: ${payload.apiRoutes}`);
  console.log(`- sitemap: ${payload.sitemap}`);
  console.log(`- lastISR: ${payload.lastISR ?? "n/a"}`);
}

process.exit(0);

export {};

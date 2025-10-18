import type { Config } from "jest";

const config: Config = {
  projects: [
    "<rootDir>/web-app/jest.config.ts",
    "<rootDir>/ui-library/jest.config.ts"
  ],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "web-app/**/*.{ts,tsx}",
    "ui-library/src/**/*.{ts,tsx}"
  ]
};

export default config;

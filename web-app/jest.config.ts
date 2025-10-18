import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig: Config = {
  displayName: "web-app",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  moduleNameMapper: {
    "^@dcc/ui-library/(.*)$": "<rootDir>/../ui-library/src/$1",
    "^@dcc/ui-library$": "<rootDir>/../ui-library/src/index.ts",
    "^@dcc/web-app/(.*)$": "<rootDir>/$1",
    "^@dcc/web-app$": "<rootDir>"
  }
};

export default createJestConfig(customJestConfig);

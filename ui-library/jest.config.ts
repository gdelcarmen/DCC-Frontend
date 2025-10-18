import type { Config } from "jest";

const config: Config = {
  displayName: "ui-library",
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "jest-environment-jsdom",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  moduleNameMapper: {
    "^@dcc/ui-library/(.*)$": "<rootDir>/src/$1",
    "^@dcc/ui-library$": "<rootDir>/src/index.ts",
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "<rootDir>/tsconfig.json"
    }
  }
};

export default config;

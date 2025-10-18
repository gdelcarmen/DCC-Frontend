module.exports = {
  root: true,
  ignorePatterns: [
    "node_modules",
    "dist",
    "coverage",
    ".next",
    "out",
    "build"
  ],
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      typescript: {
        project: [
          "./tsconfig.base.json",
          "./web-app/tsconfig.json",
          "./ui-library/tsconfig.json",
          "./cms-schemas/tsconfig.json"
        ]
      }
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  rules: {
    "import/order": [
      "warn",
      {
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        },
        "newlines-between": "always"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": "off"
  },
  overrides: [
    {
      files: ["*.cjs"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ]
};

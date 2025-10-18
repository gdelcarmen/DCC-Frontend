module.exports = {
  extends: ["next/core-web-vitals", "../.eslintrc.cjs"],
  parserOptions: {
    tsconfigRootDir: __dirname
  },
  rules: {
    "react/jsx-filename-extension": [
      "warn",
      {
        extensions: [".tsx"]
      }
    ]
  }
};

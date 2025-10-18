module.exports = {
  extends: ["../.eslintrc.cjs"],
  parserOptions: {
    tsconfigRootDir: __dirname
  },
  rules: {
    "react/react-in-jsx-scope": "off"
  }
};

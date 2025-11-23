/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: { browser: true, es2022: true, node: true },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  rules: {
    "no-unused-vars": ["warn", { "args": "none", "varsIgnorePattern": "^_" }],
    "no-undef": "error"
  }
};
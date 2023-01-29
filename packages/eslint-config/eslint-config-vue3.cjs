/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rules = require('./shared/rules.cjs');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules,
};

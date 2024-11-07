// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ...eslint.configs.recommended,
    languageOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      indent: [2, 2],
    },
  },
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      '@typescript-eslint/no-require-imports': 0,
    },
  }
);

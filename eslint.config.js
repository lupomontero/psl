// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
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
    ignores: ['dist/*', 'data/*'],
  },
);

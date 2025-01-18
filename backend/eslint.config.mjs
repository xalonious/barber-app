// eslint.config.mjs
import eslint from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import jestPlugin from 'eslint-plugin-jest';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json', 
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      'no-unused-vars': 'warn',
      "@typescript-eslint/no-unused-vars": 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
  {
    files: ['**/__tests__/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.test.json', 
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    env: {
      'jest/globals': true,
    },
  },
];

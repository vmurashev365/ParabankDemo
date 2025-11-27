import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const disallowXPathSelectorRule = {
  selector: "CallExpression[callee.property.name='locator'] Literal[value=/^\\/\\//]",
  message: 'Avoid raw XPath selectors; prefer semantic Playwright locators (TODO: replace with parser-aware rule).',
};

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-unused-vars': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'max-lines-per-file': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
      'no-restricted-syntax': ['warn', disallowXPathSelectorRule],
    },
  },
];

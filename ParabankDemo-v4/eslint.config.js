const js = require('@eslint/js');
const parser = require('@typescript-eslint/parser');
const ts = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: { parser },
    plugins: { '@typescript-eslint': ts },
    rules: {
      ...js.configs.recommended.rules,
      'no-undef': 'off', // TypeScript checks globals and type names.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'prefer-const': 'error',
    },
  },
];

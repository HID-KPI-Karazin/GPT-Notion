const eslintPluginTs = require('@typescript-eslint/eslint-plugin');
const eslintParserTs = require('@typescript-eslint/parser');
const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: eslintParserTs,
      parserOptions: { project: './tsconfig.json' }
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      prettier: eslintPluginPrettier
    },
    rules: {
      'no-unused-vars': 'error',
      'prettier/prettier': 'error'
    }
  },
  require('eslint-config-prettier')
];

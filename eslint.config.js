const eslintPluginTs = require('@typescript-eslint/eslint-plugin');
const eslintParserTs = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: eslintParserTs,
      parserOptions: { project: './tsconfig.json' }
    },
    plugins: { '@typescript-eslint': eslintPluginTs },
    rules: {
      'no-unused-vars': 'error'
    }
  }
];

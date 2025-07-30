import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import eslintParserTs from '@typescript-eslint/parser';

export default [
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

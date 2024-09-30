// eslint.config.js
import typeScriptParser from '@typescript-eslint/parser';
import typeScriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['src/**/*.{js,ts}'],
    languageOptions: {
      parser: typeScriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        // Definisci le variabili globali necessarie
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        require: 'readonly',
        // Aggiungi altre variabili globali se necessario
      },
    },
    plugins: {
      '@typescript-eslint': typeScriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error',{
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
      'prettier/prettier': 'error',
      // Aggiungi altre regole se necessario
    },
    // "env" è stato rimosso e sostituito da "globals"
  },
];

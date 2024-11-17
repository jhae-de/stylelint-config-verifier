import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tslint from 'typescript-eslint';

export default tslint.config(
  {
    extends: [eslint.configs.recommended, ...tslint.configs.recommendedTypeChecked, prettier],
    ignores: ['dist/**/*', 'types/**/*'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      parserOptions: {
        project: 'tsconfig.eslint.json',
      },
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    extends: [tslint.configs.disableTypeChecked],
  },
);

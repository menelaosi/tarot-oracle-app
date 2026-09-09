import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['**/*.js', '**/*.js.map', '**/*.d.ts', '**/*.d.ts.map']),
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      // Formatting is Prettier's job (see .prettierrc.json). This turns off every
      // ESLint rule that would fight it, so `lint` is purely about code quality.
      // Must stay last.
      prettier,
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Object shapes are `type X = {}`; interface only for real merging / extends.
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
])

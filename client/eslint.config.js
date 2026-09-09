import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // Formatting is Prettier's job (see .prettierrc.json). This turns off every
      // ESLint rule that would fight it, so `lint` is purely about code quality.
      // Must stay last.
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Object shapes and component props are written as `type X = {}`, matching
      // the shared components/ layer; interface is only for real declaration
      // merging / extends, which nothing here needs.
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
])

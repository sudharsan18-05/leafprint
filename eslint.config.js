import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Disallow console.log in production code (allow warn/error for debugging)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Catch unused variables early
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      // Enforce === over ==
      'eqeqeq': ['error', 'always'],
      // Require braces for all control statements
      'curly': ['error', 'all'],
      // Prefer const over let where possible
      'prefer-const': 'error',
      // No duplicate keys in objects
      'no-duplicate-imports': 'error',
    },
  },
])

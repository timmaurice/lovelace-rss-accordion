import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import litPlugin from 'eslint-plugin-lit';
import wcPlugin from 'eslint-plugin-wc';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    // `dist/` is generated; the two Playwright directories are too, and a failed
    // end-to-end run drops thousands of lintable lines into them.
    ignores: ['dist/', 'playwright-report/', 'test-results/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    plugins: {
      lit: litPlugin,
      wc: wcPlugin,
    },
    rules: {
      ...litPlugin.configs.recommended.rules,
      ...wcPlugin.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  prettierConfig,
);

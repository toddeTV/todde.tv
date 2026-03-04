// @ts-check
import pluginFormat from 'eslint-plugin-format'
import * as pluginJsonc from 'eslint-plugin-jsonc'
import * as pluginYml from 'eslint-plugin-yml'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // ── Global ignores ──────────────────────────────────────────────────────────
  {
    ignores: [
      '.nuxt/',
      '.output/',
      'dist/',
      '.data/',
      '.claude/skills/**/.skilld/',
      'pnpm-lock.yaml',
    ],
  },

  // ── JSON / JSONC support ────────────────────────────────────────────────────
  ...pluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    files: ['**/*.json', '**/*.jsonc'],
    rules: {
      'jsonc/sort-keys': 'error',
    },
  },
  {
    // Disable JSONC sort-keys for files where key order is meaningful
    files: [
      '.vscode/settings.json',
      'package.json',
      'tsconfig.json',
    ],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },

  // ── YAML support ────────────────────────────────────────────────────────────
  ...pluginYml.configs['flat/standard'],

  // ── Prettier formatting for CSS ─────────────────────────────────────────────
  {
    files: ['**/*.css'],
    languageOptions: {
      parser: pluginFormat.parserPlain,
    },
    plugins: {
      format: pluginFormat,
    },
    rules: {
      'format/prettier': ['error', { parser: 'css' }],
    },
  },

  // ── Prettier formatting for HTML ────────────────────────────────────────────
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: pluginFormat.parserPlain,
    },
    plugins: {
      format: pluginFormat,
    },
    rules: {
      'format/prettier': ['error', { parser: 'html' }],
    },
  },

  // ── Prettier formatting for Markdown ────────────────────────────────────────
  {
    files: ['**/*.md'],
    languageOptions: {
      parser: pluginFormat.parserPlain,
    },
    plugins: {
      format: pluginFormat,
    },
    rules: {
      'format/prettier': ['error', { parser: 'markdown' }],
    },
  },

  // ── Stylistic overrides ─────────────────────────────────────────────────────
  {
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.ts',
      '**/*.vue',
    ],
    rules: {
      '@stylistic/max-len': ['error', {
        code: 120,
        // Ignore SVG path d attributes in Vue templates
        ignorePattern: String.raw`^\s*d="`,
      }],
    },
  },

  // ── Vue rules ───────────────────────────────────────────────────────────────
  {
    files: ['**/*.vue'],
    rules: {
      'vue/attributes-order': ['error', {
        alphabetical: true,
      }],
      'vue/max-attributes-per-line': ['error', {
        multiline: 1,
        singleline: 3,
      }],
    },
  },

  // ── Disable max-len in Markdown & YAML ──────────────────────────────────────
  {
    files: [
      '**/*.md',
      '**/*.yaml',
      '**/*.yml',
    ],
    rules: {
      '@stylistic/max-len': 'off',
    },
  },
)

import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

const resolveWorkspacePath = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const nuxtTestAliases = {
  '~': resolveWorkspacePath('./app'),
  '@': resolveWorkspacePath('./app'),
  '~~': resolveWorkspacePath('./'),
  '@@': resolveWorkspacePath('./'),
  '#shared': resolveWorkspacePath('./shared'),
  '#server': resolveWorkspacePath('./server'),
  '#build': resolveWorkspacePath('./.nuxt'),
  '#app': resolveWorkspacePath('./node_modules/nuxt/dist/app'),
} as const

export default defineConfig({
  plugins: [vue()],
  staged: {
    '*.{css,html,json,jsonc,md,mjs,ts,vue,yaml,yml}': [
      'vp exec eslint --max-warnings=0 --no-warn-ignored',
    ],
  },
  test: {
    include: [
      'app/**/*.test.ts',
      'scripts/**/*.test.ts',
      'shared/**/*.test.ts',
      'server/**/*.test.ts',
      'test/**/*.test.ts',
    ],
    alias: nuxtTestAliases,
  },
})

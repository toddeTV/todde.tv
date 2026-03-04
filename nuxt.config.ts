// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
  ],

  ssr: true,

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      // titleTemplate, description, og:site_name, and htmlAttrs.lang are handled by `@nuxtjs/seo` via `site`
      // config — do not duplicate here.
      meta: [
        { name: 'application-name', content: 'todde.tv' },
        { name: 'author', content: 'Thorsten Seyschab' },

        // Dark-only site: inform browser about color scheme and mobile chrome color.
        { name: 'color-scheme', content: 'dark' },
        { name: 'theme-color', content: '#0a0a0b' },

        // Although not a standard OG tag, some tools check for it.
        // Standard OG images are handled by `nuxt-og-image` module.
        // Standard Schema.org logos are handled by `nuxt-schema-org` module.
        { property: 'og:logo', content: 'favicon.ico' },
      ],
      htmlAttrs: {
        'data-theme-source': 'todde.tv',
      },
    },
  },

  // nitro: {
  // },

  css: [
  ],

  content: { // for `@nuxt/content`
  },

  runtimeConfig: {
    public: {
    },
  },

  compatibilityDate: '2026-03-04',

  typescript: { // for TypeScript, see https://nuxt.com/docs/guide/concepts/typescript
    // Customize app/server TypeScript config
    tsConfig: {
      compilerOptions: {
        strict: true,
      },
    },

    // Customize build-time TypeScript config
    nodeTsConfig: {
      compilerOptions: {
        strict: true,
      },
    },
  },

  eslint: { // for `@nuxt/eslint`
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
      },
    },
  },

  fonts: { // for `@nuxt/fonts`
  },

  icon: { // for `@nuxt/icon`
  },

  image: { // for `@nuxt/image`
  },
})

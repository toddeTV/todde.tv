// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    // ---
    '@nuxtjs/seo', // must be before `@nuxt/content` (Nuxt Content v3 requirement)
    '@nuxt/content',
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

  site: { // for `@nuxtjs/seo` - shared site config used by all SEO sub-modules (like `ogImage`, `schemaOrg`, etc.)
    url: 'https://todde.tv',
    name: 'todde.tv',
    description:
      'Personal portfolio of Thorsten Seyschab - IT consultant, senior full-stack developer, and conference speaker.',
    defaultLocale: 'en',
  },

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

  ogImage: { // for `nuxt-og-image` (via `@nuxtjs/seo`)
    defaults: {
      component: 'OgImageHome',
    },
  },

  schemaOrg: { // for `nuxt-schema-org` (via `@nuxtjs/seo`)
    identity: {
      type: 'Person',
      name: 'Thorsten Seyschab',
      url: 'https://todde.tv',
      image: '/avatar.jpg',
      // sameAs: [], // is populated at runtime from the `socials` content collection (see `app.vue`).
    },
  },
})

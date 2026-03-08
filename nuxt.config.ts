import tailwindcss from '@tailwindcss/vite'

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

  ssr: true, // needed for `SSR` and `SSG` (`@nuxt/content` markdown rendering happens server-side)

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      // titleTemplate, description, og:site_name, and htmlAttrs.lang are handled by `@nuxtjs/seo` via `site`
      // config - do not duplicate here.
      meta: [
        { name: 'application-name', content: 'todde.tv' },
        { name: 'author', content: 'Thorsten Seyschab' },

        // Ignored by Google since 2009, but some minor search engines (Yandex, Baidu) still
        // consider it. Harmless to include.
        {
          name: 'keywords',
          content: [
            'Thorsten Seyschab',
            'toddeTV',
            'todde.tv',
            'IT consultant',
            'IT-consultant',
            'full-stack developer',
            'full stack developer',
            'conference speaker',
            'computer science',
            'computer scientist',
            'M.Sc. Computer Science',
            'M.Sc.',
            'master',
            'master degree',
            'masters degree',
            'TUD Dresden University of Technology',
            'Dresden',
            'Dresden, Germany',
            'Dresden, Deutschland',
            'Germany',
            'Deutschland',
            'web engineer',
            'open source',
            'open-source',
            'OpenSource',
            'projects',
            'portfolio',
            'Vue',
            'Nuxt',
            'TypeScript',
          ].join(', '),
        },

        // Dark-only site: inform browser about color scheme and mobile chrome color.
        { name: 'color-scheme', content: 'dark' },
        { name: 'theme-color', content: '#0a0a0b' },

        // Although not a standard OG tag, some tools check for it.
        // Standard OG images are handled by `nuxt-og-image` module.
        // Standard Schema.org logos are handled by `nuxt-schema-org` module.
        { property: 'og:logo', content: '/favicon.svg' },
      ],
      htmlAttrs: {
        'lang': 'en',
        'data-theme-source': 'todde.tv',
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  // nitro: {
  // },

  css: [
    '~/assets/css/main.css',
  ],

  site: { // for `@nuxtjs/seo` - shared site config used by all SEO sub-modules (like `ogImage`, `schemaOrg`, etc.)
    url: 'https://todde.tv',
    // name: 'todde.tv',
    name: 'Thorsten Seyschab',
    description:
      'Personal portfolio of Thorsten Seyschab - IT consultant, senior full-stack developer, and conference speaker.',
    defaultLocale: 'en',
  },

  content: { // for `@nuxt/content`
  },

  runtimeConfig: {
    public: {
      // Legal page data - injected via GitHub Variables at build time.
      // Not committed to Git. Set `NUXT_PUBLIC_LEGAL_*` env vars (see `.env.example`).
      legalAddressStreet: '',
      legalAddressCity: '',
      legalAddressCountry: '',
      legalVatId: '',
    },
  },

  routeRules: {
    // Redirect common alternative paths for the `legal-notice` page.
    '/imprint': { redirect: { to: '/legal-notice', statusCode: 301 } },
    '/impressum': { redirect: { to: '/legal-notice', statusCode: 301 } },
    '/legal': { redirect: { to: '/legal-notice', statusCode: 301 } },

    // Redirect common alternative paths for the `privacy-policy` page.
    '/privacy': { redirect: { to: '/privacy-policy', statusCode: 301 } },
    '/datenschutz': { redirect: { to: '/privacy-policy', statusCode: 301 } },
  },

  compatibilityDate: '2026-03-04',

  vite: {
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tailwindcss() as any,
    ],
  },

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

  hooks: {
    'vite:extendConfig'(config) {
      /**
       * Only needed in SSG project:
       * Remove `@nuxtjs/mdc` client-side optimizeDeps entries - markdown
       * rendering happens server-side in this SSG project. These entries
       * cause warnings with pnpm's strict dependency hoisting.
       */
      if (config.optimizeDeps?.include) {
        config.optimizeDeps.include = config.optimizeDeps.include.filter(
          (dep: string) => !dep.startsWith('@nuxtjs/mdc >'),
        )
      }
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
    // Disable runtime fallback to the external Iconify API (api.iconify.design).
    // Without this, missing icons would trigger client-side requests to a third-party
    // server, transmitting visitor IP addresses - a GDPR/DSGVO concern.
    // All used icons are bundled at build time; missing ones simply won't render - but this should not happen.
    fallbackToApi: false,
  },

  image: { // for `@nuxt/image`
  },

  ogImage: { // for `nuxt-og-image` (via `@nuxtjs/seo`)
    componentDirs: [
      'OgImage',
      // 'OgImageTemplate',
    ],
    defaults: {
      component: 'Default',
    },
  },

  robots: { // for `nuxt-robots` (via `@nuxtjs/seo`)
    // Blocking AI training crawlers while allowing search/browsing agents is sufficient for
    // discoverability. AI search tools (ChatGPT browsing, Perplexity, Google AI) use separate
    // user-agents that remain unblocked, so asking an AI "who is X" still returns results.
    // Training data also comes from GitHub, conference sites, LinkedIn, NPM, etc. - blocking
    // this portfolio alone does not remove the person from AI model knowledge.
    groups: [
      {
        comment: [
          'Block AI training crawlers.',
          'Search/browsing agents (ChatGPT-User, PerplexityBot, Googlebot) are intentionally NOT listed here.',
        ],
        userAgent: [
          'GPTBot', // OpenAI (training + plugins)
          'CCBot', // Common Crawl (training data source for many AI companies)
          'Google-Extended', // Google Gemini AI training (does NOT affect Google Search)
          'ClaudeBot', // Anthropic web fetching
          'anthropic-ai', // Anthropic training crawler
          'Bytespider', // ByteDance / TikTok AI training
          'Applebot-Extended', // Apple AI training (does NOT affect Siri/Spotlight)
          'meta-externalagent', // Meta AI training
          'cohere-ai', // Cohere AI training
          'Omgilibot', // Omgili data mining
          'FacebookBot', // Meta / Facebook AI training

          // outdated:
          'Claude-Web', // Anthropic web fetching (replaced by "ClaudeBot")
          'anthropic-ai', // Anthropic training crawler (outdated, replaced by "ClaudeBot")
        ],
        disallow: ['/'],
      },
      {
        userAgent: '*',
        allow: '/',
        contentUsage: {
          'bots': 'y',
          'search': 'y',
          'ai-output': 'y',
          'train-ai': 'n',
        },
        contentSignal: {
          'search': 'yes',
          'ai-input': 'yes',
          'ai-train': 'no',
        },
      },
    ],
  },

  schemaOrg: { // for `nuxt-schema-org` (via `@nuxtjs/seo`)
    identity: {
      type: 'Person',
      name: 'Thorsten Seyschab',
      url: 'https://todde.tv',
      image: '/avatar-thorsten-seyschab.jpg',
      // logo: '/favicon.svg', // not a standard Schema.org property for Person, but some tools check for it.
      // `sameAs` and `email` are populated at runtime from the `socials` content collection (see `app.vue`).
    },
  },
})

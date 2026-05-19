import tailwindcss from '@tailwindcss/vite'
import { resolveBuildReleaseMetadata } from './server/utils/build-release-metadata'
import { buildProjectMetadataRedirectRouteRules, getProjectMetadata } from './shared/utils/project-metadata'

const buildReleaseMetadata = resolveBuildReleaseMetadata()
const projectMetadata = getProjectMetadata()
const redirectRouteRules = buildProjectMetadataRedirectRouteRules()
const seoKeywords = [
  projectMetadata.author.name,
  projectMetadata.author.nickname,
  projectMetadata.projectName,
  projectMetadata.author.location,
  ...projectMetadata.seo.extraKeywords,
].join(', ')
const staticMachineReadableTextRouteRule = {
  prerender: true,
  headers: {
    'cache-control': 'public, max-age=86400, s-maxage=604800',
  },
} as const

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
        { name: 'application-name', content: projectMetadata.projectName },
        { name: 'author', content: projectMetadata.author.name },

        // Ignored by Google since 2009, but some minor search engines (Yandex, Baidu) still
        // consider it. Harmless to include.
        {
          name: 'keywords',
          content: seoKeywords,
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
        'data-theme-source': projectMetadata.projectName,
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  css: [
    '~/assets/css/main.css',
  ],

  site: { // for `@nuxtjs/seo` - shared site config used by all SEO sub-modules (like `ogImage`, `schemaOrg`, etc.)
    url: projectMetadata.siteUrl,
    // name: 'todde.tv',
    name: projectMetadata.author.name,
    description: projectMetadata.siteDescription,
    defaultLocale: 'en',
  },

  content: { // for `@nuxt/content`
  },

  runtimeConfig: {
    public: {
      build: {
        commitShort: buildReleaseMetadata.commitShort,
        dateIso: buildReleaseMetadata.buildDateIso,
        releaseLabel: buildReleaseMetadata.releaseLabel,
      },
      // Legal page data - injected via GitHub Variables at build time.
      // Not committed to Git. Set `NUXT_PUBLIC_LEGAL_*` env vars (see `.env.example`).
      legalName: '',
      legalOccupation: '',
      legalOccupationDe: '',
      legalEmail: '',
      legalPhone: '',
      legalAddressStreet: '',
      legalAddressCity: '',
      legalAddressCountry: '',
      legalVatId: '',
    },
  },

  routeRules: {
    // Redirect paths come from `project-metadata.config.ts`.
    // The Cloudflare Pages `_redirects` artifact and local `routeRules` fallback share this source.
    ...redirectRouteRules,

    // Build these machine-readable text endpoints as static files for Cloudflare Pages SSG.
    '/.well-known/security.txt': staticMachineReadableTextRouteRule,
    '/humans.txt': staticMachineReadableTextRouteRule,
  },

  compatibilityDate: '2026-03-04',

  nitro: {
    prerender: {
      // Routes not discoverable by the crawler (e.g. not linked from any page).
      routes: [
        '/g',
        '/vcard',
      ],
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@unhead/schema-org/vue',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
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
    'build:before'() {
      /**
       * Validate that all required legal env vars are set and non-empty.
       * Prevents building a site with broken/incomplete legal pages.
       * Only runs during `pnpm run build:ssr` / `pnpm run build:ssg` - skipped during
       * `nuxt prepare` (postinstall), `nuxt dev`, and `nuxt typecheck`.
       *
       * Detection uses `npm_lifecycle_event` (set by the package manager to the
       * script name, e.g. `build:ssg`) with a fallback to Nuxt CLI subcommands
       * in `process.argv` for direct `nuxt build` / `nuxt generate` invocations.
       */
      const lifecycle = process.env.npm_lifecycle_event
      const isBuildOrGenerate
        = lifecycle === 'build:ssr'
          || lifecycle === 'build:ssg'
          || process.argv.some(a => a === 'build' || a === 'generate')
      if (!isBuildOrGenerate) return

      const required = [
        'NUXT_PUBLIC_LEGAL_NAME',
        'NUXT_PUBLIC_LEGAL_OCCUPATION',
        'NUXT_PUBLIC_LEGAL_OCCUPATION_DE',
        'NUXT_PUBLIC_LEGAL_EMAIL',
        'NUXT_PUBLIC_LEGAL_PHONE',
        'NUXT_PUBLIC_LEGAL_ADDRESS_STREET',
        'NUXT_PUBLIC_LEGAL_ADDRESS_CITY',
        'NUXT_PUBLIC_LEGAL_ADDRESS_COUNTRY',
        'NUXT_PUBLIC_LEGAL_VAT_ID',
      ]
      const missing = required.filter(key => !process.env[key]?.trim())
      if (missing.length > 0) {
        throw new Error(
          `Build aborted: required legal env vars are missing or empty:\n`
          + missing.map(k => `  - ${k}`).join('\n')
          + `\nSet them in \`.env\` (local) or GitHub Variables (CI). See \`.env.example\`.`,
        )
      }
    },

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
      // 'OgImage',
      'OgImageTemplate',
    ],
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
      name: projectMetadata.author.name,
      url: projectMetadata.author.url,
      image: '/avatar-thorsten-seyschab.jpg',
      // logo: '/favicon.svg', // not a standard Schema.org property for Person, but some tools check for it.
      // `sameAs` and `email` are populated from the hydrated project metadata at runtime.
    },
  },

  sitemap: { // for `nuxt-simple-sitemap` (via `@nuxtjs/seo`)
    exclude: [
      '/vcard',
    ],
  },
})

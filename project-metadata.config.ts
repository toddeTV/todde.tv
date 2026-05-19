/**
 * Project metadata model.
 *
 * Layers:
 * - `ProjectMetadata`: raw base values from this file
 * - `HydratedProjectMetadata`: raw values plus socials-derived fields
 *
 * Access:
 * - Raw: `getProjectMetadata()`
 * - Hydrated: `prepareProjectMetadata()`
 * - App runtime: `useProjectMetadata()`
 *
 * Rules:
 * - Keep only non-hydrated source values here
 * - Keep this file aligned with `shared/utils/project-metadata.ts`
 */
export interface ProjectMetadata {
  author: {
    contact?: string
    lastName: string
    firstName: string
    handle: string
    location: string
    name: string
    nickname: string
    role: string
    sameAs?: string[]
    url: string
  }
  legal: {
    legalNoticePath: string
    privacyPolicyPath: string
  }
  redirects: ProjectMetadataRedirectGroup[]
  projectName: string
  repository: {
    licenseUrl: string
    url: string
  }
  seo: {
    extraKeywords: string[]
  }
  security: {
    contact: string
    preferredLanguages: string[]
  }
  siteDescription: string
  siteUrl: string
}

export interface ProjectMetadataRedirectEntry {
  from: string
  statusCode: number
  to: string
}

export interface ProjectMetadataRedirectGroup {
  comment: string
  entries: ProjectMetadataRedirectEntry[]
}

export interface ProjectMetadataRedirectRouteRule {
  redirect: {
    statusCode: number
    to: string
  }
}

export interface ProjectMetadataSocialEntry {
  active?: boolean
  featured: boolean
  handle: string
  icon: string
  name: string
  sortOrder: number
  url: string
}

/**
 * Hydrated metadata shape.
 *
 * Adds:
 * - normalized `author.contact`
 * - normalized `author.sameAs`
 * - grouped socials collections
 */
export interface HydratedProjectMetadata<TSocial extends ProjectMetadataSocialEntry = ProjectMetadataSocialEntry>
  extends Omit<ProjectMetadata, 'author'>
{
  author: Omit<ProjectMetadata['author'], 'contact' | 'sameAs'> & {
    contact: string
    sameAs: string[]
  }
  emailSocials: TSocial[]
  featuredSocials: TSocial[]
  phoneSocials: TSocial[]
  primaryEmailSocial: TSocial | null
  primaryPhoneSocial: TSocial | null
  profileSocials: TSocial[]
  socials: TSocial[]
}

const LEGAL_NOTICE_PATH = '/legal-notice'
const PRIVACY_POLICY_PATH = '/privacy-policy'
const SECURITY_TXT_PATH = '/.well-known/security.txt'

/**
 * Raw config source.
 *
 * Keep out:
 * - socials lists
 * - featured/grouped socials
 * - derived primary contact fields
 */
const projectMetadataConfig = {
  /** Author base data. */
  author: {
    contact: undefined, // hydrated from first active `mailto:` social
    sameAs: undefined, // hydrated from featured profile socials

    /** Raw name fields. */
    lastName: 'Seyschab',
    firstName: 'Thorsten',

    /** Base handles and labels. */
    handle: '@toddeTV',
    location: 'Dresden, Germany',
    name: 'Thorsten Seyschab',
    nickname: 'toddeTV',

    /** Base role text. */
    role: 'IT consultant, senior full-stack developer, and conference speaker',

    /** Canonical author URL. */
    url: 'https://todde.tv',
  },

  /** Legal routes. */
  legal: {
    legalNoticePath: LEGAL_NOTICE_PATH,
    privacyPolicyPath: PRIVACY_POLICY_PATH,
  },

  /** Redirect aliases used in route rules and Cloudflare Pages `_redirects`. */
  redirects: [
    {
      comment: 'Legal Notice alternative paths',
      entries: [
        { from: '/imprint', to: LEGAL_NOTICE_PATH, statusCode: 301 },
        { from: '/impressum', to: LEGAL_NOTICE_PATH, statusCode: 301 },
        { from: '/legal', to: LEGAL_NOTICE_PATH, statusCode: 301 },
      ],
    },
    {
      comment: 'Privacy Policy alternative paths',
      entries: [
        { from: '/privacy', to: PRIVACY_POLICY_PATH, statusCode: 301 },
        { from: '/datenschutz', to: PRIVACY_POLICY_PATH, statusCode: 301 },
      ],
    },
    {
      comment: 'Machine-readable metadata alias',
      entries: [
        { from: '/security.txt', to: SECURITY_TXT_PATH, statusCode: 301 },
      ],
    },
  ],

  /** Project identity. */
  projectName: 'todde.tv',

  /** Repository links. */
  repository: {
    licenseUrl: 'https://github.com/toddeTV/todde.tv/blob/main/LICENSE.md',
    url: 'https://github.com/toddeTV/todde.tv',
  },

  /** SEO-only keyword variants. */
  seo: {
    extraKeywords: [
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
    ],
  },

  /**
   * RFC 9116 metadata.
   * Keep separate from `author`, as the security mail might differ from the main contact.
   */
  security: {
    /** Explicit RFC 9116 contact URI. */
    contact: 'mailto:hello@todde.tv',

    /** Preferred languages for `security.txt`. */
    preferredLanguages: [
      'en',
      'de',
    ],
  },

  /** Site description. */
  siteDescription:
    'Personal portfolio of Thorsten Seyschab - IT consultant, senior full-stack developer, and conference speaker.',

  /** Canonical site URL. */
  siteUrl: 'https://todde.tv',
} satisfies ProjectMetadata

/** Returns redirect groups from `project-metadata.config.ts` in declaration order. */
export function getProjectMetadataRedirectGroups(): ProjectMetadataRedirectGroup[] {
  return projectMetadataConfig.redirects
}

/** Returns all redirect entries from `project-metadata.config.ts` in declaration order. */
export function getProjectMetadataRedirectEntries(): ProjectMetadataRedirectEntry[] {
  return getProjectMetadataRedirectGroups().flatMap(group => group.entries)
}

/** Builds the Nuxt `routeRules` redirect subset from project metadata redirects. */
export function buildProjectMetadataRedirectRouteRules(): Record<string, ProjectMetadataRedirectRouteRule> {
  return Object.fromEntries(
    getProjectMetadataRedirectEntries().map(entry => [
      entry.from,
      {
        redirect: {
          to: entry.to,
          statusCode: entry.statusCode,
        },
      },
    ]),
  )
}

/** Renders the Cloudflare Pages `_redirects` file from project metadata redirects. */
export function renderProjectMetadataRedirectsFile(): string {
  const lines = [
    '# Cloudflare Pages edge-level redirects.',
    '# Generated from `project-metadata.config.ts`. Do not edit manually.',
  ]

  for (const group of getProjectMetadataRedirectGroups()) {
    lines.push('', `# ${group.comment}`)
    for (const entry of group.entries) {
      lines.push(`${entry.from} ${entry.to} ${entry.statusCode}`)
    }
  }

  return `${lines.join('\n')}\n`
}

export default projectMetadataConfig

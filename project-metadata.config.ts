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
    familyName: string
    givenName: string
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
    familyName: 'Seyschab',
    givenName: 'Thorsten',

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
    legalNoticePath: '/legal-notice',
    privacyPolicyPath: '/privacy-policy',
  },

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

export default projectMetadataConfig

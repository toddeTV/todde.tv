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
  security: {
    contact: string
    preferredLanguages: string[]
  }
  siteDescription: string
  siteUrl: string
}

// Base project metadata only.
// Hydration and normalization happen in `shared/utils/project-metadata.ts`.
// Raw access: `getProjectMetadata()`.
// Hydrated access with socials merged in: `prepareProjectMetadata()`.
// Frontend app/runtime code should prefer `app/composables/useProjectMetadata.ts`
// and call `useProjectMetadata()` for reactive, socials-enriched metadata.
// Backend, server, build, and plain sync code should use `getProjectMetadata()`
// when the raw shape is enough and no socials-derived fields are needed.
// Use `prepareProjectMetadata()` in non-frontend contexts only when you already
// have socials data and need the hydrated shape.
// Hydrated-only root fields such as `socials`, `featuredSocials`, `emailSocials`,
// `phoneSocials`, `profileSocials`, `primaryEmailSocial`, and
// `primaryPhoneSocial` do not belong in this file.
// Keep this file, its comments, and `shared/utils/project-metadata.ts` in sync.
const projectMetadataConfig = {
  // Base author fields.
  // Hydration may add or replace `author.contact` from the first active `mailto:` social.
  // Hydration may add or replace `author.sameAs` from featured profile socials.
  // Keep only non-social base author data in this object.
  author: {
    // Raw name fields. Not modified by hydration.
    familyName: 'Seyschab',
    givenName: 'Thorsten',

    // Base handles and display labels. Not modified by hydration.
    handle: '@toddeTV',
    location: 'Dresden, Germany',
    name: 'Thorsten Seyschab',
    nickname: 'toddeTV',

    // Base role text.
    // Frontend consumers should read this through `useProjectMetadata()`.
    // Plain sync and backend consumers should read it through `getProjectMetadata()`.
    role: 'IT consultant, senior full-stack developer, and conference speaker',

    // Canonical author/site URL. Not modified by hydration.
    url: 'https://todde.tv',
  },

  // Legal route metadata.
  // Not modified by hydration.
  legal: {
    legalNoticePath: '/legal-notice',
    privacyPolicyPath: '/privacy-policy',
  },

  // Base project/site identity.
  // Not modified by hydration.
  projectName: 'todde.tv',

  // Repository metadata.
  // Not modified by hydration.
  repository: {
    licenseUrl: 'https://github.com/toddeTV/todde.tv/blob/main/LICENSE.md',
    url: 'https://github.com/toddeTV/todde.tv',
  },

  // Machine-readable security metadata.
  // Not hydrated from socials.
  // Keep `security.contact` distinct from hydrated `author.contact`.
  security: {
    // RFC 9116 contact URI. Must stay explicit here.
    contact: 'mailto:hello@todde.tv',

    // Preferred languages for `security.txt`. Not modified by hydration.
    preferredLanguages: [
      'en',
      'de',
    ],
  },

  // Base site-wide descriptive text.
  // Not modified by hydration.
  siteDescription:
    'Personal portfolio of Thorsten Seyschab - IT consultant, senior full-stack developer, and conference speaker.',

  // Canonical site URL.
  // Not modified by hydration.
  siteUrl: 'https://todde.tv',
} satisfies ProjectMetadata

export default projectMetadataConfig

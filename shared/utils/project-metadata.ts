import rawProjectMetadata from '../../project.config.json'

const MAILTO_PREFIX = 'mailto:'
const TEL_PREFIX = 'tel:'

export interface ProjectMetadataSocialEntry {
  active?: boolean
  featured: boolean
  handle: string
  icon: string
  name: string
  sortOrder: number
  url: string
}

export interface ProjectMetadataConfig {
  author: {
    contact?: string
    familyName: string
    givenName: string
    handle: string
    location: string
    name: string
    nickname: string
    role: string
    roleSummary: string
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

export interface PreparedProjectMetadata<TSocial extends ProjectMetadataSocialEntry = ProjectMetadataSocialEntry>
  extends Omit<ProjectMetadataConfig, 'author'> {
  author: Omit<ProjectMetadataConfig['author'], 'contact' | 'sameAs'> & {
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

/** Returns the raw project metadata config stored in `project.config.json`. */
export function getProjectMetadataConfig(): ProjectMetadataConfig {
  return rawProjectMetadata as ProjectMetadataConfig
}

function isMailtoUrl(url: string): boolean {
  return url.startsWith(MAILTO_PREFIX)
}

function isPhoneUrl(url: string): boolean {
  return url.startsWith(TEL_PREFIX)
}

function isProfileUrl(url: string): boolean {
  return !isMailtoUrl(url) && !isPhoneUrl(url)
}

function removeMailtoPrefix(url: string): string {
  return isMailtoUrl(url) ? url.slice(MAILTO_PREFIX.length) : url
}

function dedupeUrls(urls: string[]): string[] {
  return Array.from(new Set(urls))
}

/**
 * Merges the raw project config with active socials content so app and server code
 * can consume one prepared metadata object.
 */
export function prepareProjectMetadata<TSocial extends ProjectMetadataSocialEntry>(
  socials: TSocial[] = [],
): PreparedProjectMetadata<TSocial> {
  const projectMetadataConfig = getProjectMetadataConfig()
  const sortedSocials = [...socials]
    .filter(social => social.active !== false)
    .sort((left, right) => left.sortOrder - right.sortOrder)
  const featuredSocials = sortedSocials.filter(social => social.featured)
  const emailSocials = sortedSocials.filter(social => isMailtoUrl(social.url))
  const phoneSocials = sortedSocials.filter(social => isPhoneUrl(social.url))
  const profileSocials = sortedSocials.filter(social => isProfileUrl(social.url))
  const primaryEmailSocial = emailSocials[0] ?? null
  const primaryPhoneSocial = phoneSocials[0] ?? null
  const sameAs = dedupeUrls(
    featuredSocials
      .filter(social => isProfileUrl(social.url))
      .map(social => social.url),
  )

  return {
    ...projectMetadataConfig,
    author: {
      ...projectMetadataConfig.author,
      contact: primaryEmailSocial
        ? removeMailtoPrefix(primaryEmailSocial.url)
        : (projectMetadataConfig.author.contact ?? ''),
      sameAs: sameAs.length > 0
        ? sameAs
        : dedupeUrls(projectMetadataConfig.author.sameAs ?? []),
    },
    socials: sortedSocials,
    featuredSocials,
    emailSocials,
    phoneSocials,
    profileSocials,
    primaryEmailSocial,
    primaryPhoneSocial,
  }
}

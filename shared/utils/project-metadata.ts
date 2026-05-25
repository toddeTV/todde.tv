import projectMetadataConfig, {
  type HydratedProjectMetadata,
  type ProjectMetadata,
  type ProjectMetadataSocialEntry,
} from '../../project-metadata.config'

const MAILTO_PREFIX = 'mailto:'
const TEL_PREFIX = 'tel:'

export type {
  HydratedProjectMetadata,
  ProjectMetadata,
  ProjectMetadataRedirectEntry,
  ProjectMetadataRedirectGroup,
  ProjectMetadataRedirectRouteRule,
  ProjectMetadataSocialEntry,
} from '../../project-metadata.config'

export {
  buildProjectMetadataRedirectRouteRules,
  getProjectMetadataRedirectEntries,
  getProjectMetadataRedirectGroups,
  renderProjectMetadataRedirectsFile,
} from '../../project-metadata.config'

/** Returns the raw project metadata stored in `project-metadata.config.ts`. */
export function getProjectMetadata(): ProjectMetadata {
  return projectMetadataConfig
}

export function isMailtoUrl(url: string): boolean {
  return url.startsWith(MAILTO_PREFIX)
}

export function isPhoneUrl(url: string): boolean {
  return url.startsWith(TEL_PREFIX)
}

export function isProfileUrl(url: string): boolean {
  return !isMailtoUrl(url) && !isPhoneUrl(url)
}

export function removeMailtoPrefix(url: string): string {
  return isMailtoUrl(url) ? url.slice(MAILTO_PREFIX.length) : url
}

export function dedupeUrls(urls: string[]): string[] {
  return Array.from(new Set(urls))
}

/**
 * Merges the raw project metadata with active socials content so app and server code
 * can consume one hydrated metadata object.
 */
export function prepareProjectMetadata<TSocial extends ProjectMetadataSocialEntry>(
  socials: TSocial[] = [],
): HydratedProjectMetadata<TSocial> {
  const projectMetadata = getProjectMetadata()
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
    ...projectMetadata,
    author: {
      ...projectMetadata.author,
      contact: primaryEmailSocial
        ? removeMailtoPrefix(primaryEmailSocial.url)
        : (projectMetadata.author.contact ?? ''),
      sameAs: sameAs.length > 0
        ? sameAs
        : dedupeUrls(projectMetadata.author.sameAs ?? []),
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

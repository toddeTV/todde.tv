import type { SocialsCollectionItem } from '@nuxt/content'
import { queryCollection } from '@nuxt/content/server'

/** Returns the plain text `humans.txt` response using hydrated project metadata. */
export default defineEventHandler(async (event) => {
  const socials = await queryCollection(event, 'socials').all() as SocialsCollectionItem[]
  const { author, legal, projectName, repository, siteDescription, siteUrl } = prepareProjectMetadata(socials)
  const legalNoticeUrl = new URL(legal.legalNoticePath, siteUrl).toString()
  const privacyPolicyUrl = new URL(legal.privacyPolicyPath, siteUrl).toString()
  const runtimeConfig = useRuntimeConfig(event)
  const authorProfiles = author.sameAs.map(profileUrl => `  Profile: ${profileUrl}`)

  const content = [
    '# humanstxt.org/',
    '',
    '/* PROJECT */',
    `  Name: ${projectName}`,
    `  Version: ${runtimeConfig.public.build.releaseLabel}`,
    `  URL: ${siteUrl}`,
    `  Description: ${siteDescription}`,
    `  Legal Notice: ${legalNoticeUrl}`,
    `  Privacy Policy: ${privacyPolicyUrl}`,
    '',
    '/* AUTHOR */',
    `  Name: ${author.name}`,
    `  Role: ${author.role}`,
    `  Contact: ${author.contact}`,
    `  Website: ${author.url}`,
    ...authorProfiles,
    '',
    '/* SOURCE CODE */',
    `  Repository: ${repository.url}`,
    `  License: ${repository.licenseUrl}`,
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `${content}\n`
})

import projectConfig from '~~/project.config.json'

export default defineEventHandler((event) => {
  const { author, legal, projectName, repository, siteDescription, siteUrl } = projectConfig
  const legalNoticeUrl = new URL(legal.legalNoticePath, siteUrl).toString()
  const privacyPolicyUrl = new URL(legal.privacyPolicyPath, siteUrl).toString()
  const runtimeConfig = useRuntimeConfig(event)

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
    `  Contact: ${author.contact}`,
    `  Website: ${author.url}`,
    `  Location: ${author.location}`,
    '',
    '/* SOURCE CODE */',
    `  Repository: ${repository.url}`,
    '',
    '/* LEGAL DISCLAIMER */',
    `  License: ${repository.licenseUrl}`,
    `  Legal Notice: ${legalNoticeUrl}`,
    `  Privacy Policy: ${privacyPolicyUrl}`,
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `${content}\n`
})

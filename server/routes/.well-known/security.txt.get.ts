import projectConfig from '~~/project.config.json'
import { buildSecurityTxtContent } from '#server/utils/security-txt'

export default defineEventHandler((event) => {
  const content = buildSecurityTxtContent({
    canonicalUrl: new URL('/.well-known/security.txt', projectConfig.siteUrl).toString(),
    contact: projectConfig.security.contact,
    preferredLanguages: projectConfig.security.preferredLanguages,
  })

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return content
})

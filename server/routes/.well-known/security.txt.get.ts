import { buildSecurityTxtContent } from '#server/utils/security-txt'

const projectMetadata = getProjectMetadata()

export default defineEventHandler((event) => {
  const content = buildSecurityTxtContent({
    canonicalUrl: new URL('/.well-known/security.txt', projectMetadata.siteUrl).toString(),
    contact: projectMetadata.security.contact,
    preferredLanguages: projectMetadata.security.preferredLanguages,
  })

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return content
})

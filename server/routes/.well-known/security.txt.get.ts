import projectConfig from '~~/project.config.json'

const defaultSecurityTxtLifetimeDays = 180

interface SecurityTxtContentOptions {
  canonicalUrl: string
  contact: string
  policyUrl?: string
  preferredLanguages: string[]
}

/** Returns the ISO 8601 expiration timestamp for `security.txt`. */
function createSecurityTxtExpires(
  now: Date = new Date(),
  lifetimeDays: number = defaultSecurityTxtLifetimeDays,
): string {
  const expiresAt = new Date(now.getTime())

  expiresAt.setUTCDate(expiresAt.getUTCDate() + lifetimeDays)

  return expiresAt.toISOString()
}

/** Builds the plain text `security.txt` response body from route metadata. */
function buildSecurityTxtContent(
  options: SecurityTxtContentOptions,
  now: Date = new Date(),
): string {
  const lines = [
    `Contact: ${options.contact}`,
    `Expires: ${createSecurityTxtExpires(now)}`,
    `Canonical: ${options.canonicalUrl}`,
    `Preferred-Languages: ${options.preferredLanguages.join(', ')}`,
  ]

  if (options.policyUrl) {
    lines.push(`Policy: ${options.policyUrl}`)
  }

  return `${lines.join('\n')}\n`
}

export default defineEventHandler((event) => {
  const content = buildSecurityTxtContent({
    canonicalUrl: new URL('/.well-known/security.txt', projectConfig.siteUrl).toString(),
    contact: projectConfig.security.contact,
    preferredLanguages: projectConfig.security.preferredLanguages,
  })

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return content
})

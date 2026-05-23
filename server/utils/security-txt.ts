export const defaultSecurityTxtLifetimeDays = 180

export interface SecurityTxtContentOptions {
  canonicalUrl: string
  contact: string
  policyUrl?: string
  preferredLanguages: string[]
}

/** Returns the ISO 8601 expiration timestamp for `security.txt`. */
export function createSecurityTxtExpires(
  now: Date = new Date(),
  lifetimeDays: number = defaultSecurityTxtLifetimeDays,
): string {
  const expiresAt = new Date(now.getTime())

  expiresAt.setUTCDate(expiresAt.getUTCDate() + lifetimeDays)

  return expiresAt.toISOString()
}

/** Builds the plain text `security.txt` response body from route metadata. */
export function buildSecurityTxtContent(
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

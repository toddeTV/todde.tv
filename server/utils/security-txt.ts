const defaultSecurityTxtLifetimeDays = 180

export interface SecurityTxtContentOptions {
  canonicalUrl: string
  contact: string
  policyUrl?: string
  preferredLanguages: string[]
}

export function createSecurityTxtExpires(
  now: Date = new Date(),
  lifetimeDays: number = defaultSecurityTxtLifetimeDays,
): string {
  const expiresAt = new Date(now.getTime())

  expiresAt.setUTCDate(expiresAt.getUTCDate() + lifetimeDays)

  return expiresAt.toISOString()
}

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

export { defaultSecurityTxtLifetimeDays }

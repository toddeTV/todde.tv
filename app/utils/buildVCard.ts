/**
 * Builds a vCard 3.0 string from selected contact fields.
 * Used by the /vcard page to generate QR code content.
 */

interface VCardFixedFields {
  /** Include full name (Thorsten Seyschab). */
  name: boolean
  /** Include nickname / handle (@toddeTV). */
  nickname: boolean
  /** Include website URL (https://todde.tv). */
  website: boolean
  /** Include short bio/description. */
  bio: boolean
}

interface VCardSocialEntry {
  /** Social platform display name (e.g. "GitHub"). */
  name: string
  /** Full URL (profile URL, mailto:, or tel:). */
  url: string
}

/**
 * Escapes special characters in vCard 3.0 property values.
 * Backslash, semicolon, comma, and newlines must be escaped per RFC 2426.
 * @param value - raw property value
 * @returns escaped value safe for vCard embedding
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Builds a vCard 3.0 string from the provided fields.
 * @param fixed - toggle flags for name, website, and bio
 * @param emails - array of selected email addresses (raw, without mailto: prefix)
 * @param phones - array of selected phone numbers (raw, without tel: prefix)
 * @param socials - array of selected social profile entries
 * @returns formatted vCard 3.0 string
 */
export function buildVCard(
  fixed: VCardFixedFields,
  emails: string[],
  phones: string[],
  socials: VCardSocialEntry[],
): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ]

  if (fixed.name) {
    lines.push('N:Seyschab;Thorsten;;;')
    lines.push('FN:Thorsten Seyschab')
  }

  if (fixed.nickname) {
    // NICKNAME is recognized by Apple Contacts but ignored on Android.
    lines.push('NICKNAME:toddeTV')
  }

  if (fixed.website) {
    lines.push('URL:https://todde.tv')
  }

  // Build NOTE from handle and/or bio (handle first, two blank lines between).
  const noteParts: string[] = []
  if (fixed.nickname) {
    noteParts.push('@toddeTV')
  }
  if (fixed.bio) {
    noteParts.push('IT consultant, senior full-stack developer, and conference speaker.')
  }
  if (noteParts.length > 0) {
    lines.push(`NOTE:${noteParts.join(' - ')}`)
  }

  for (const email of emails) {
    lines.push(`EMAIL:${escapeVCardValue(email)}`)
  }

  for (const phone of phones) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(phone)}`)
  }

  // Social profiles as X-SOCIALPROFILE with TYPE labels.
  // Only the TYPE parameter value is escaped; the URL is kept raw since colons are structural.
  for (const social of socials) {
    lines.push(`X-SOCIALPROFILE;TYPE=${escapeVCardValue(social.name)}:${social.url}`)
  }

  lines.push('END:VCARD')
  return lines.join('\r\n')
}

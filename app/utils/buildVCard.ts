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
    lines.push(`EMAIL:${email}`)
  }

  for (const phone of phones) {
    lines.push(`TEL;TYPE=CELL:${phone}`)
  }

  // Social profiles as X-SOCIALPROFILE with TYPE labels.
  for (const social of socials) {
    lines.push(`X-SOCIALPROFILE;TYPE=${social.name}:${social.url}`)
  }

  lines.push('END:VCARD')
  return lines.join('\r\n')
}

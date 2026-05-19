const TEL_PREFIX = 'tel:'

/**
 * Normalizes a phone string by stripping the `tel:` prefix and separator characters.
 * Preserves a leading `+` and returns an empty string when no digits remain.
 */
function normalizePhoneValue(phone: string): string {
  const trimmedPhone = phone.trim()
  const rawPhone = trimmedPhone.startsWith(TEL_PREFIX)
    ? trimmedPhone.slice(TEL_PREFIX.length)
    : trimmedPhone
  const hasLeadingPlus = rawPhone.startsWith('+')
  const digits = rawPhone.replace(/\D/g, '')

  return digits
    ? `${hasLeadingPlus ? '+' : ''}${digits}`
    : ''
}

/**
 * Builds a `tel:` URI from a human-readable phone string.
 * Accepts display values such as `+49 176 00000000` and existing `tel:` URIs.
 */
export function buildPhoneUri(phone: string): string {
  const normalizedPhone = normalizePhoneValue(phone)

  return normalizedPhone
    ? `${TEL_PREFIX}${normalizedPhone}`
    : ''
}

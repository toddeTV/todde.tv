export interface VCardSelectableSocialEntry {
  id: string
  url: string
}

export function isEmailSocialEntry<TEntry extends VCardSelectableSocialEntry>(entry: TEntry): boolean {
  return /^mailto:/i.test(entry.url)
}

export function isPhoneSocialEntry<TEntry extends VCardSelectableSocialEntry>(entry: TEntry): boolean {
  return /^tel:/i.test(entry.url)
}

/** Split vCard socials into email, phone, and profile groups. */
export function partitionVCardSocialEntries<TEntry extends VCardSelectableSocialEntry>(
  socials: readonly TEntry[] | null | undefined,
) {
  const entries = socials ?? []

  return {
    emailEntries: entries.filter(isEmailSocialEntry),
    phoneEntries: entries.filter(isPhoneSocialEntry),
    socialEntries: entries.filter(entry => !isEmailSocialEntry(entry) && !isPhoneSocialEntry(entry)),
  }
}

/** Build the default checkbox state for vCard entry selection. */
export function buildDefaultVCardSelectionMap<TEntry extends VCardSelectableSocialEntry>(
  socials: readonly TEntry[] | null | undefined,
): Record<string, boolean> {
  const entries = socials ?? []
  const { emailEntries, phoneEntries } = partitionVCardSocialEntries(entries)
  const firstSelectedIds = new Set<string>()
  const firstEmail = emailEntries[0]
  const firstPhone = phoneEntries[0]

  if (firstEmail) firstSelectedIds.add(firstEmail.id)
  if (firstPhone) firstSelectedIds.add(firstPhone.id)

  const defaults: Record<string, boolean> = {}

  for (const entry of entries) {
    defaults[entry.id] = firstSelectedIds.has(entry.id)
  }

  return defaults
}

import type { SocialsCollectionItem } from '@nuxt/content'

/**
 * Manages checkbox selection state for the vCard page.
 * Derives email/phone/social entry groups from the socials collection and
 * maintains toggle states for fixed fields and per-entry selections.
 * @param socials - reactive reference to the socials collection data
 */
export function useVCardSelection(socials: Ref<SocialsCollectionItem[] | null | undefined>) {
  /** Email entries extracted from socials (sorted by sortOrder). */
  const emailEntries = computed(() =>
    (socials.value ?? []).filter(s => s.url.startsWith('mailto:')),
  )

  /** Phone entries extracted from socials (sorted by sortOrder). */
  const phoneEntries = computed(() =>
    (socials.value ?? []).filter(s => s.url.startsWith('tel:')),
  )

  /** Social profile entries (excluding emails and phones). */
  const socialEntries = computed(() =>
    (socials.value ?? []).filter(s => !s.url.startsWith('mailto:') && !s.url.startsWith('tel:')),
  )

  // --- Fixed-field toggles ---

  const includeName = ref(true)
  const includeNickname = ref(true)
  const includeWebsite = ref(true)
  const includeBio = ref(true)

  /**
   * Reactive map of communication/social entry id to checked state.
   * First email and first phone are pre-selected; all others unchecked.
   */
  const checked = ref<Record<string, boolean>>({})

  /** Initializes default checked state once socials data is available. */
  function initDefaults() {
    const first = new Set<string>()
    const firstEmail = emailEntries.value[0]
    const firstPhone = phoneEntries.value[0]
    if (firstEmail) first.add(firstEmail.id)
    if (firstPhone) first.add(firstPhone.id)

    const defaults: Record<string, boolean> = {}
    for (const entry of socials.value ?? []) {
      if (entry.url.startsWith('mailto:') || entry.url.startsWith('tel:')) {
        defaults[entry.id] = first.has(entry.id)
      }
      else {
        defaults[entry.id] = false
      }
    }
    checked.value = defaults
  }

  // Set defaults once data is loaded (runs during SSR and on client).
  watchEffect(() => {
    if (socials.value?.length && Object.keys(checked.value).length === 0) {
      initDefaults()
    }
  })

  return {
    emailEntries,
    phoneEntries,
    socialEntries,
    includeName,
    includeNickname,
    includeWebsite,
    includeBio,
    checked,
  }
}

<script setup lang="ts">
import QRCode from 'qrcode'

const { data: projectMetadata } = await useProjectMetadata()
const authorName = computed(() => projectMetadata.value?.author.name ?? '')
const authorHandle = computed(() => projectMetadata.value?.author.handle ?? '')
const projectName = computed(() => projectMetadata.value?.projectName ?? '')

useSeoMeta({
  title: 'vCard',
  description: () => `Generate a QR code contact card for ${authorName.value}.`,
})

// Personal utility page - exclude from search engine indexing (robots file)
useRobotsRule(false)

defineOgImage('Default')
const socials = computed(() => projectMetadata.value?.socials)

const {
  emailEntries,
  phoneEntries,
  socialEntries,
  includeName,
  includeNickname,
  includeWebsite,
  includeBio,
  checked,
} = useVCardSelection(socials)

/** Computed vCard string based on current checkbox state. */
const vcardString = computed(() => {
  const selectedEmails = emailEntries.value
    .filter(s => checked.value[s.id])
    .map(s => s.url.replace('mailto:', ''))

  const selectedPhones = phoneEntries.value
    .filter(s => checked.value[s.id])
    .map(s => s.url.replace('tel:', ''))

  const selectedSocials = socialEntries.value
    .filter(s => checked.value[s.id])
    .map(s => ({ name: s.name, url: s.url }))

  if (!projectMetadata.value) {
    return ''
  }

  return buildVCard(
    projectMetadata.value,
    {
      name: includeName.value,
      nickname: includeNickname.value,
      website: includeWebsite.value,
      bio: includeBio.value,
    },
    selectedEmails,
    selectedPhones,
    selectedSocials,
  )
})

// --- QR code generation (client-side only) ---

const qrDataUrl = ref('')
const qrError = ref(false)
const isMounted = ref(false)

/**
 * Generates a QR code data URL from the current vCard string.
 * Runs only on the client side after mount.
 */
async function generateQrCode() {
  try {
    qrError.value = false
    qrDataUrl.value = await QRCode.toDataURL(vcardString.value, {
      width: 400,
      margin: 2,
      // QR foreground/background must be raw hex (library requirement).
      // dark = neutral-900 (#141416), light = neutral-50 (#fafafa) - update if palette changes.
      color: {
        dark: '#141416',
        light: '#fafafa',
      },
      errorCorrectionLevel: 'M',
    })
  }
  catch {
    qrDataUrl.value = ''
    qrError.value = true
  }
}

onMounted(() => {
  isMounted.value = true
  generateQrCode()
})

watch(vcardString, () => {
  if (isMounted.value) {
    generateQrCode()
  }
})
</script>

<template>
  <div>
    <AppSection>
      <h1 class="mb-2">
        Contact Card - vcard
      </h1>
      <p class="mb-8 text-lg">
        Scan the QR code to save the contact. Toggle the checkboxes to customize what gets included.
      </p>

      <!-- QR Code -->
      <div class="mb-10 flex justify-center">
        <div
          class="flex h-70 w-70 items-center justify-center rounded-lg
            border border-border bg-surface sm:h-80 sm:w-80"
        >
          <NuxtImg
            v-if="qrDataUrl"
            :alt="`QR code encoding a vCard for ${authorName}`"
            class="h-full w-full rounded-lg"
            height="400"
            provider="none"
            :src="qrDataUrl"
            width="400"
          />
          <p v-else-if="qrError" class="text-sm text-text-muted">
            Failed to generate QR code.
          </p>
          <p v-else class="text-sm text-text-dim">
            Generating QR code...
          </p>
        </div>
      </div>

      <!-- Checkbox groups -->
      <div class="flex flex-col gap-8">
        <!-- Fixed info -->
        <fieldset>
          <legend class="mb-3 font-mono text-sm text-accent">
            Contact Info
          </legend>
          <div class="flex flex-col gap-3">
            <VCardCheckbox
              v-model="includeName"
              icon="ph:user"
              :label="`Name (${authorName})`"
            />
            <VCardCheckbox
              v-model="includeNickname"
              icon="ph:at"
              :label="`Handle (${authorHandle})`"
            />
            <VCardCheckbox
              v-model="includeWebsite"
              icon="ph:globe"
              :label="`Website (${projectName})`"
            />
            <VCardCheckbox
              v-model="includeBio"
              icon="ph:info"
              label="Bio / Description"
            />
          </div>
        </fieldset>

        <!-- Communication -->
        <fieldset v-if="emailEntries.length || phoneEntries.length">
          <legend class="mb-3 font-mono text-sm text-accent">
            Communication
          </legend>
          <div class="flex flex-col gap-3">
            <VCardCheckbox
              v-for="entry in [...emailEntries, ...phoneEntries]"
              :key="entry.id"
              v-model="checked[entry.id]"
              :icon="entry.icon"
              :label="`${entry.name} (${entry.handle})`"
            />
          </div>
        </fieldset>

        <!-- Social profiles -->
        <fieldset v-if="socialEntries.length">
          <legend class="mb-3 font-mono text-sm text-accent">
            Social Profiles
          </legend>
          <div class="flex flex-col gap-3">
            <VCardCheckbox
              v-for="social in socialEntries"
              :key="social.id"
              v-model="checked[social.id]"
              :icon="social.icon"
              :label="`${social.name} (${social.handle})`"
            />
          </div>
        </fieldset>
      </div>
    </AppSection>
  </div>
</template>

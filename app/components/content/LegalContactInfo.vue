<script setup lang="ts">
/**
 * Renders contact info (email or phone) by querying the socials collection.
 * Finds the social entry with the lowest sortOrder whose URL starts with
 * `mailto:` (for email) or `tel:` (for phone) and displays its handle.
 * Used as inline MDC component in legal content pages.
 */

const props = defineProps<{
  /** Which contact type to display. */
  type: 'email' | 'phone'
}>()

const { data: projectMetadata } = await useProjectMetadata()

const social = computed(() => {
  if (!projectMetadata.value) {
    return null
  }

  return props.type === 'email'
    ? projectMetadata.value.primaryEmailSocial
    : projectMetadata.value.primaryPhoneSocial
})
</script>

<template>
  <NuxtLink
    v-if="social"
    :to="social.url"
  >
    {{ social.handle }}
  </NuxtLink>
  <span v-else class="text-text-dim italic">
    [{{ type === 'email' ? 'Email' : 'Phone' }} not configured - add a matching social entry]
  </span>
</template>

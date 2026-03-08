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

const urlPrefix = computed(() => (props.type === 'email' ? 'mailto:' : 'tel:'))

const { data: social } = await useAsyncData(
  `legal-contact-info-${props.type}`,
  () =>
    queryCollection('socials')
      .where('active', '=', true)
      .order('sortOrder', 'ASC')
      .all(),
  {
    transform: socials =>
      socials.find(s => s.url.startsWith(urlPrefix.value)) ?? null,
  },
)
</script>

<template>
  <NuxtLink
    v-if="social"
    :href="social.url"
  >
    {{ social.handle }}
  </NuxtLink>
</template>

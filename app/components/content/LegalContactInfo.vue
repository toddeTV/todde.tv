<script setup lang="ts">
/**
 * Renders legal contact info from runtimeConfig.
 * Used as inline MDC component in legal content pages.
 */

const props = defineProps<{
  /** Which contact type to display. */
  type: 'email' | 'phone'
}>()

const config = useRuntimeConfig()

const label = computed(() => {
  return props.type === 'email'
    ? config.public.legalEmail as string
    : config.public.legalPhoneDisplay as string
})

const url = computed(() => {
  return props.type === 'email'
    ? `mailto:${config.public.legalEmail as string}`
    : config.public.legalPhoneUri as string
})
</script>

<template>
  <NuxtLink
    v-if="label && url"
    :to="url"
  >
    {{ label }}
  </NuxtLink>
  <span v-else class="text-text-dim italic">
    [{{ type === 'email' ? 'Email' : 'Phone' }} not configured - set matching legal env vars]
  </span>
</template>

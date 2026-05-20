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
const legalEmail = computed(() => config.public.legalEmail as string)
const legalPhone = computed(() => config.public.legalPhone as string)

const label = computed(() => {
  return props.type === 'email'
    ? legalEmail.value
    : legalPhone.value
})

const url = computed(() => {
  return props.type === 'email'
    ? (legalEmail.value ? `mailto:${legalEmail.value}` : '')
    : buildPhoneUri(legalPhone.value)
})
</script>

<template>
  <NuxtLink
    v-if="label && url"
    :to="url"
  >
    {{ label }}
  </NuxtLink>
</template>

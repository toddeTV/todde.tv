<script setup lang="ts">
/**
 * Custom prose link component that overrides the default `@nuxtjs/mdc` ProseA.
 * Automatically adds `target="_blank"` for external links.
 * NuxtLink handles `rel="noopener noreferrer"` automatically on external links.
 */

const props = defineProps<{
  href?: string
  target?: string
}>()

const isExternal = computed(() => {
  if (!props.href) return false
  return /^https?:\/\//.test(props.href)
})

const linkTarget = computed(() => {
  if (props.target) return props.target
  return isExternal.value ? '_blank' : undefined
})
</script>

<template>
  <NuxtLink
    :href="href"
    :target="linkTarget"
  >
    <slot />
  </NuxtLink>
</template>

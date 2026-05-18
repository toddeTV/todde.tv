<script setup lang="ts">
/**
 * Default/fallback OG image component for generic pages.
 * Used by [...slug].vue when no specific OG component is configured.
 */
withDefaults(defineProps<{
  /** Page title override. */
  title?: string
  /** Page description override. */
  description?: string
}>(), {
  title: 'todde.tv',
  description: 'IT consultant, senior full-stack developer, and conference speaker.',
})
</script>

<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: '#0a0a0b',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <OgImageGlow />
    <OgImageAvatar />

    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        maxWidth: '960px',
        padding: '60px 80px',
        boxSizing: 'border-box',
      }"
    >
      <OgImageTitle size="md" :text="title" />
      <OgImageDescription v-if="description" size="lg" :text="description" />
    </div>

    <OgImageFooter />
  </div>
</template>

<script setup lang="ts">
/**
 * Default/fallback OG image component for generic pages.
 * Used by [...slug].vue when no specific OG component is configured.
 * Rendered by Satori (not a browser) - must use inline styles, <img>, and hardcoded colors.
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
      padding: '60px 80px',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <OgImageGlow />
    <OgImageAvatar />

    <!-- Main content -->
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        maxWidth: '960px',
      }"
    >
      <OgImageTitle size="md" :text="title" />
      <OgImageDescription v-if="description" size="lg" :text="description" />
    </div>

    <OgImageFooter />
  </div>
</template>

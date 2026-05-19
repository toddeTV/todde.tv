<script setup lang="ts">
const props = defineProps<{
  /** Page title override. */
  title?: string
  /** Page description override. */
  description?: string
}>()

const projectMetadata = getProjectMetadata()
const resolvedTitle = computed(() => props.title ?? projectMetadata.projectName)
const resolvedDescription = computed(() => props.description ?? projectMetadata.author.role)

/**
 * Default/fallback OG image component for generic pages.
 * Used by [...slug].vue when no specific OG component is configured.
 */
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
      <OgImageTitle size="md" :text="resolvedTitle" />
      <OgImageDescription v-if="resolvedDescription" size="lg" :text="resolvedDescription" />
    </div>

    <OgImageFooter />
  </div>
</template>

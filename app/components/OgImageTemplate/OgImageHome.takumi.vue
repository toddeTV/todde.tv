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
 * Default OG image component for the homepage.
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

    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: '740px',
        padding: '60px 30px 60px 60px',
        boxSizing: 'border-box',
      }"
    >
      <OgImageTitle :text="resolvedTitle" />
      <OgImageDescription size="lg" :text="resolvedDescription" />
    </div>

    <div
      :style="{
        position: 'absolute',
        top: '115px',
        right: '80px',
        width: '350px',
        height: '350px',
        borderRadius: '999px',
        background: 'linear-gradient(135deg, #00dc82, #00c474)',
        padding: '5px',
      }"
    >
      <NuxtImg
        height="340"
        src="/avatar-thorsten-seyschab.jpg"
        :style="{
          width: '340px',
          height: '340px',
          borderRadius: '999px',
          objectFit: 'cover',
        }"
        width="340"
      />
    </div>

    <OgImageFooter />
  </div>
</template>

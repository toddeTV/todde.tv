<script setup lang="ts">
/**
 * Default OG image component for the homepage.
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
      padding: '60px',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <OgImageGlow />

    <div
      :style="{
        position: 'absolute',
        top: '315px',
        left: '60px',
        width: '600px',
        height: '1px',
        background: 'linear-gradient(90deg, rgba(0,220,130,0.15), transparent)',
      }"
    />

    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        width: '670px',
      }"
    >
      <OgImageTitle :text="title" />
      <OgImageDescription size="lg" :text="description" />
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

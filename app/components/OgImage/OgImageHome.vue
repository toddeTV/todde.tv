<script setup lang="ts">
/**
 * Default OG image component for the homepage.
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
      justifyContent: 'space-between',
      backgroundColor: '#0a0a0b',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '60px',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <!-- Radial accent glow (top-right) -->
    <div
      :style="{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,220,130,0.07) 0%, transparent 70%)',
      }"
    />

    <!-- Top row: text left, avatar right -->
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }"
    >
      <!-- Title and description -->
      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '750px',
        }"
      >
        <div
          :style="{
            fontSize: '64px',
            fontWeight: 700,
            color: '#fafafa',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }"
        >
          {{ title }}
        </div>
        <div
          :style="{
            fontSize: '28px',
            fontWeight: 400,
            color: '#a1a1aa',
            lineHeight: 1.4,
          }"
        >
          {{ description }}
        </div>
      </div>

      <!-- Avatar with accent gradient border -->
      <div
        :style="{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00dc82, #00c474)',
          padding: '4px',
          flexShrink: '0',
        }"
      >
        <img
          alt="Thorsten Seyschab"
          src="/avatar.jpg"
          :style="{
            width: '132px',
            height: '132px',
            borderRadius: '50%',
            objectFit: 'cover',
          }"
        >
      </div>
    </div>

    <OgImageFooter />
  </div>
</template>

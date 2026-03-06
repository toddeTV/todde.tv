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
      justifyContent: 'center',
      backgroundColor: '#0a0a0b',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '60px',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <!-- Radial accent glow (top-right, behind avatar) -->
    <div
      :style="{
        position: 'absolute',
        top: '-80px',
        right: '100px',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,220,130,0.25) 0%, transparent 65%)',
      }"
    />

    <!-- Secondary glow (bottom-left) -->
    <div
      :style="{
        position: 'absolute',
        bottom: '-200px',
        left: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,220,130,0.18) 0%, transparent 65%)',
      }"
    />

    <!-- Subtle horizontal rule -->
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

    <!-- Title and description (vertically centered) -->
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        gap: '20px',
        width: '670px',
      }"
    >
      <div
        :style="{
          fontSize: '72px',
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
          fontSize: '30px',
          fontWeight: 400,
          color: '#a1a1aa',
          lineHeight: 1.5,
        }"
      >
        {{ description }}
      </div>
    </div>

    <!-- Avatar with accent gradient border (large, centered-right) -->
    <div
      :style="{
        position: 'absolute',
        top: '115px',
        right: '80px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00dc82, #00c474)',
        padding: '5px',
      }"
    >
      <img
        alt="Thorsten Seyschab"
        src="/avatar-thorsten-seyschab.webp"
        :style="{
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          objectFit: 'cover',
        }"
      >
    </div>

    <!-- Footer (absolute to stay at bottom despite centered content) -->
    <div
      :style="{
        position: 'absolute',
        bottom: '60px',
        left: '60px',
        right: '60px',
      }"
    >
      <OgImageFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Shared avatar for non-Home OG image components.
 * Renders a circular avatar with accent gradient border in the top-right corner.
 * Satori constraints: inline styles only, no Tailwind, hardcoded colors.
 */
</script>

<template>
  <div
    :style="{
      position: 'absolute',
      top: '48px',
      right: '80px',
      width: '130px',
      height: '130px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #00dc82, #27272a)',
      padding: '4px',
      flexWrap: 'nowrap',
    }"
  >
    <img
      alt="Thorsten Seyschab"
      src="/avatar-thorsten-seyschab.jpg"
      :style="{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover',
      }"
    >
  </div>
</template>

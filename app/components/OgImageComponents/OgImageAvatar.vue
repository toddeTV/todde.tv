<script setup lang="ts">
/**
 * Shared avatar for non-Home OG image components.
 * Renders a circular avatar with accent gradient border in the top-right corner.
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
      borderRadius: '999px',
      background: 'linear-gradient(135deg, #00dc82, #27272a)',
      padding: '4px',
    }"
  >
    <NuxtImg
      height="120"
      src="/avatar-thorsten-seyschab.jpg"
      :style="{
        width: '120px',
        height: '120px',
        borderRadius: '999px',
        objectFit: 'cover',
      }"
      width="120"
    />
  </div>
</template>

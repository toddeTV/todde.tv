<script setup lang="ts">
/**
 * Shared ambient glow effects for all OG image components.
 * Renders two radial gradient spotlights: top-right and bottom-left.
 * Satori constraints: inline styles only, no Tailwind, hardcoded colors.
 */
</script>

<template>
  <!-- Radial accent glow (top-right) -->
  <div
    :style="{
      position: 'absolute',
      top: '-180px',
      right: '-120px',
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
</template>

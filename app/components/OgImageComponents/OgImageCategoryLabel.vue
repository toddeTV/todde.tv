<script setup lang="ts">
/**
 * Green uppercase category label for OG images (e.g. "Project", "Talk", "Client Project").
 */
defineProps<{
  /** The category text to display (e.g. "Project", "Talk"). */
  text: string
}>()
</script>

<template>
  <div
    :style="{
      fontSize: '16px',
      fontWeight: 600,
      color: '#00dc82',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: '20px',
    }"
  >
    {{ text }}
  </div>
</template>

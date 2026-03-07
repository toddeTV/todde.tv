<script setup lang="ts">
/**
 * Shared footer for all OG image components.
 * Renders author name (left), site URL (right), and a bottom gradient accent line.
 * Satori constraints: inline styles only, no Tailwind, hardcoded colors.
 */
</script>

<template>
  <div
    :style="{
      position: 'absolute',
      bottom: '60px',
      left: '60px',
      right: '60px',
    }"
  >
    <!-- Author name and site URL -->
    <div
      :style="{
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }"
    >
      <div
        :style="{
          fontSize: '24px',
          fontWeight: 600,
          color: '#00dc82',
        }"
      >
        Thorsten Seyschab
      </div>
      <div
        :style="{
          fontSize: '22px',
          fontWeight: 400,
          color: '#71717a',
        }"
      >
        todde.tv
      </div>
    </div>

    <!-- Bottom gradient accent line -->
    <div
      :style="{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, #00dc82, #00c474, transparent)',
      }"
    />
  </div>
</template>

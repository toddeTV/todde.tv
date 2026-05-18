<script setup lang="ts">
/**
 * OG image component for talk pages.
 * Rendered by Satori (not a browser) - must use inline styles and hardcoded colors.
 */
defineProps<{
  title?: string
  event?: string
  date?: string
  location?: string
}>()
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
      padding: '60px 80px',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <OgImageGlow />
    <OgImageAvatar />

    <!-- Main content -->
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        maxWidth: '960px',
      }"
    >
      <OgImageCategoryLabel text="Talk" />

      <OgImageTitle size="md" :text="title || 'Conference Talk'" />

      <OgImageDescription v-if="event" :text="event" />

      <!-- Date and location row -->
      <!--
        class="flex-row" prevents nuxt-og-image's flex plugin from overriding
        flexDirection to 'column' (it does so for any div containing div children
        unless the parent has a class containing "flex-").
        Text nodes use <span> to avoid being classified as block elements.
      -->
      <div
        v-if="date || location"
        class="flex-row"
        :style="{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          marginTop: '20px',
        }"
      >
        <!-- Phosphor calendar-blank icon (regular weight) -->
        <svg
          v-if="date"
          height="18"
          :style="{ width: '18px', height: '18px', marginRight: '8px' }"
          viewBox="0 0 256 256"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160z"
            fill="#71717a"
          />
        </svg>
        <span
          v-if="date"
          :style="{
            fontSize: '18px',
            color: '#71717a',
            fontFamily: 'monospace',
            marginRight: location ? '32px' : '0',
          }"
        >
          {{ date }}
        </span>
        <!-- Phosphor map-pin icon (regular weight) -->
        <svg
          v-if="location"
          height="18"
          :style="{ width: '18px', height: '18px', marginRight: '8px' }"
          viewBox="0 0 256 256"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.2 254.2 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.2 254.2 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118"
            fill="#71717a"
          />
        </svg>
        <span
          v-if="location"
          :style="{
            fontSize: '18px',
            color: '#71717a',
          }"
        >
          {{ location }}
        </span>
      </div>
    </div>

    <OgImageFooter />
  </div>
</template>

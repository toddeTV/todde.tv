<script setup lang="ts">
/**
 * OG image component for open source project pages.
 * Rendered by Satori (not a browser) - must use inline styles, <img>, and hardcoded colors.
 */
defineProps<{
  title?: string
  description?: string
  repoStars?: number
  tags?: string[]
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
      <OgImageCategoryLabel text="Open Source" />

      <!-- Project name with stars -->
      <div
        class="flex-row"
        :style="{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          marginBottom: '20px',
        }"
      >
        <span
          :style="{
            fontSize: '72px',
            fontWeight: 800,
            color: '#fafafa',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }"
        >
          {{ title || 'Project' }}
        </span>
        <span
          v-if="repoStars"
          class="flex-row"
          :style="{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            marginLeft: '20px',
          }"
        >
          <!-- Phosphor star icon (regular weight) -->
          <svg
            height="28"
            :style="{ width: '28px', height: '28px', marginRight: '6px' }"
            viewBox="0 0 256 256"
            width="28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M239.18 97.26A16.38 16.38 0 0 0 224.92 86l-59-4.76l-22.78-55.09a16.36 16.36 0 0 0-30.27 0L90.11 81.23L31.08 86a16.46 16.46 0 0 0-9.37 28.86l45 38.83L53 211.75a16.38 16.38 0 0 0 24.5 17.82L128 198.49l50.53 31.08A16.4 16.4 0 0 0 203 211.75l-13.76-58.07l45-38.83a16.38 16.38 0 0 0 4.94-17.59m-15.34 5.47l-48.7 42a8 8 0 0 0-2.56 7.91l14.88 62.8a.37.37 0 0 1-.17.48c-.18.14-.23.11-.38 0l-54.72-33.65a8 8 0 0 0-8.38 0l-54.72 33.67c-.15.09-.2.12-.38 0a.37.37 0 0 1-.17-.48l14.88-62.8a8 8 0 0 0-2.56-7.91l-48.7-42c-.12-.1-.18-.16-.13-.31s.18-.22.36-.23l63.65-5.13a8 8 0 0 0 6.71-4.85l24.62-59.6c.08-.17.11-.25.3-.25s.22.08.29.25l24.63 59.6a8 8 0 0 0 6.71 4.85l63.65 5.13c.18 0 .31.08.36.23s0 .21-.13.31"
              fill="#71717a"
            />
          </svg>
          <span
            :style="{
              fontSize: '28px',
              color: '#71717a',
              fontFamily: 'monospace',
            }"
          >
            {{ repoStars }}
          </span>
        </span>
      </div>

      <OgImageDescription v-if="description" :max-length="120" :text="description" />

      <!-- Tags -->
      <div
        v-if="tags?.length"
        class="flex-row"
        :style="{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          marginTop: '20px',
        }"
      >
        <!-- Phosphor tag icon (regular weight) -->
        <svg
          height="18"
          :style="{ width: '18px', height: '18px', marginRight: '8px' }"
          viewBox="0 0 256 256"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M243.31 136L144 36.69A15.86 15.86 0 0 0 132.69 32H40a8 8 0 0 0-8 8v92.69A15.86 15.86 0 0 0 36.69 144L136 243.31a16 16 0 0 0 22.63 0l84.68-84.68a16 16 0 0 0 0-22.63M148 240L48 140V48h92l100 100ZM96 84a12 12 0 1 1-12-12a12 12 0 0 1 12 12"
            fill="#71717a"
          />
        </svg>
        <span
          :style="{
            fontSize: '18px',
            color: '#71717a',
            fontFamily: 'monospace',
          }"
        >
          {{ tags.slice(0, 4).join('  \u00B7  ') }}
        </span>
      </div>
    </div>

    <OgImageFooter />
  </div>
</template>

<script setup lang="ts">
const { data: socials } = await useAsyncData('socials-only-featured', () =>
  queryCollection('socials')
    .where('active', '=', true)
    .where('featured', '=', true)
    .order('sortOrder', 'ASC')
    .all(),
)

const START_YEAR = 2026

const today = useTodayDate()
const currentYear = computed(() => Number(today.value.slice(0, 4)))

/** Returns "2026" if current year equals start year, otherwise "2026-{currentYear}". */
const yearSpan = computed(() =>
  currentYear.value === START_YEAR ? `${START_YEAR}` : `${START_YEAR}-${currentYear.value}`,
)
</script>

<template>
  <footer class="mt-8">
    <AppSeparator />
    <AppContainer class="py-8 flex flex-col items-center gap-4">
      <div class="flex items-center gap-4">
        <NuxtLink
          v-for="social in socials"
          :key="social.url"
          :aria-label="social.name"
          class="flex items-center"
          target="_blank"
          :to="social.url"
        >
          <Icon :name="social.icon" :size="20" />
        </NuxtLink>
        <NuxtLink
          aria-label="All socials"
          class="flex items-center text-sm font-mono ml-2"
          to="/#connect"
        >
          <span class="tracking-[-0.5em] mr-1.5">...</span> more
        </NuxtLink>
      </div>

      <p class="text-xs text-text-dim text-center">
        Created with <Icon class="inline-block" name="ph:heart" :size="12" /> by
        Thorsten Seyschab, &copy; {{ yearSpan }}, All Rights Reserved.
      </p>

      <p class="text-xs text-text-dim text-center">
        Source on
        <NuxtLink
          class="text-xs"
          target="_blank"
          to="https://github.com/toddeTV/todde.tv"
        >
          GitHub
        </NuxtLink>
        .
      </p>
    </AppContainer>
  </footer>
</template>

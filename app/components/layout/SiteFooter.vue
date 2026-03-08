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
    <AppContainer class="flex flex-col items-center gap-4 py-8">
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
          class="ml-2 flex items-center font-mono text-sm"
          to="/#connect"
        >
          <span class="mr-1.5 tracking-[-0.5em]">...</span> more
        </NuxtLink>
      </div>

      <p class="text-center text-xs text-text-dim">
        Created with <Icon class="inline-block" name="ph:heart" :size="12" /> by
        Thorsten Seyschab, &copy; {{ yearSpan }}, All Rights Reserved.
      </p>

      <p class="text-center text-xs text-text-dim">
        <NuxtLink class="text-xs text-text-dim hover:text-text" to="/legal-notice">
          Legal Notice
        </NuxtLink>
        <span class="mx-1.5">·</span>
        <NuxtLink class="text-xs text-text-dim hover:text-text" to="/privacy-policy">
          Privacy Policy
        </NuxtLink>
        <span class="mx-1.5">·</span>
        Source on
        <NuxtLink
          class="text-xs"
          target="_blank"
          to="https://github.com/toddeTV/todde.tv"
        >
          GitHub
        </NuxtLink>
      </p>
    </AppContainer>
  </footer>
</template>

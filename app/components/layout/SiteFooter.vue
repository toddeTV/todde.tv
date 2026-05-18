<script setup lang="ts">
const { data: socials } = await useAsyncData('socials-only-featured', () =>
  queryCollection('socials')
    .where('active', '=', true)
    .where('featured', '=', true)
    .order('sortOrder', 'ASC')
    .all(),
)

const START_YEAR = 2026
const REPOSITORY_URL = 'https://github.com/toddeTV/todde.tv'

const today = useTodayDate()
const currentYear = computed(() => Number(today.value.slice(0, 4)))
const runtimeConfig = useRuntimeConfig()
const releaseLabel = runtimeConfig.public.build.releaseLabel

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

      <p class="flex flex-wrap items-center justify-center gap-y-1 text-center text-xs text-text-dim">
        <span class="inline-flex items-center whitespace-nowrap">
          <!-- `link-checker/valid-sitemap-link` does not resolve content-backed catch-all pages here, so we need: -->
          <!-- eslint-disable-next-line link-checker/valid-sitemap-link -->
          <NuxtLink class="text-xs text-text-dim hover:text-text" to="/legal-notice">
            Legal Notice
          </NuxtLink>

          <span aria-hidden="true" class="mx-1.5">·</span>
        </span>

        <span class="inline-flex items-center whitespace-nowrap">
          <!-- `link-checker/valid-sitemap-link` does not resolve content-backed catch-all pages here, so we need: -->
          <!-- eslint-disable-next-line link-checker/valid-sitemap-link -->
          <NuxtLink class="text-xs text-text-dim hover:text-text" to="/privacy-policy">
            Privacy Policy
          </NuxtLink>

          <span aria-hidden="true" class="mx-1.5">·</span>
        </span>

        <span class="inline-flex items-center whitespace-nowrap">
          <span>Version {{ releaseLabel }}</span>

          <NuxtLink
            aria-label="GitHub repository"
            class="relative -top-px ml-1.5 inline-flex items-center align-middle text-xs"
            target="_blank"
            :to="REPOSITORY_URL"
          >
            <Icon name="simple-icons:github" :size="14" />
          </NuxtLink>
        </span>
      </p>
    </AppContainer>
  </footer>
</template>

<script setup lang="ts">
const { data: projectMetadata } = await useProjectMetadata()

const START_YEAR = 2026

const today = useTodayDate()
const currentYear = computed(() => Number(today.value.slice(0, 4)))
const runtimeConfig = useRuntimeConfig()
const releaseLabel = runtimeConfig.public.build.releaseLabel
const featuredSocials = computed(() => projectMetadata.value?.featuredSocials ?? [])
const authorName = computed(() => projectMetadata.value?.author.name ?? '')
const legalNoticePath = computed(() => projectMetadata.value?.legal.legalNoticePath ?? '/legal-notice')
const privacyPolicyPath = computed(() => projectMetadata.value?.legal.privacyPolicyPath ?? '/privacy-policy')
const repositoryUrl = computed(() => projectMetadata.value?.repository.url ?? '')

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
          v-for="social in featuredSocials"
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
        {{ authorName }}, &copy; {{ yearSpan }}, All Rights Reserved.
      </p>

      <p class="flex flex-wrap items-center justify-center gap-y-1 text-center text-xs text-text-dim">
        <span class="inline-flex items-center whitespace-nowrap">
          <!-- `link-checker/valid-sitemap-link` does not resolve content-backed catch-all pages here, so we need: -->
          <!-- eslint-disable-next-line link-checker/valid-sitemap-link -->
          <NuxtLink class="text-xs text-text-dim hover:text-text" :to="legalNoticePath">
            Legal Notice
          </NuxtLink>

          <span aria-hidden="true" class="mx-1.5">·</span>
        </span>

        <span class="inline-flex items-center whitespace-nowrap">
          <!-- `link-checker/valid-sitemap-link` does not resolve content-backed catch-all pages here, so we need: -->
          <!-- eslint-disable-next-line link-checker/valid-sitemap-link -->
          <NuxtLink class="text-xs text-text-dim hover:text-text" :to="privacyPolicyPath">
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
            :to="repositoryUrl"
          >
            <Icon name="simple-icons:github" :size="14" />
          </NuxtLink>
        </span>
      </p>
    </AppContainer>
  </footer>
</template>

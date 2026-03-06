<script setup lang="ts">
const { data: socials } = await useAsyncData('socials-only-featured', () =>
  queryCollection('socials')
    .where('active', '=', true)
    .where('featured', '=', true)
    .order('sortOrder', 'ASC')
    .all(),
)

const year = useState('footer-year', () => new Date().getFullYear())

if (import.meta.client) {
  onMounted(() => {
    year.value = new Date().getFullYear()
  })
}
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
          class="text-text-dim hover:text-accent transition-colors flex items-center"
          target="_blank"
          :to="social.url"
        >
          <Icon :name="social.icon" :size="20" />
        </NuxtLink>
        <NuxtLink
          aria-label="All socials"
          class="text-text-dim hover:text-accent transition-colors flex items-center text-sm font-mono ml-2"
          to="/#connect"
        >
          <span class="tracking-[-0.5em] mr-1.5">...</span> more
        </NuxtLink>
      </div>
      <p class="text-xs text-text-dim">
        &copy; {{ year }} Thorsten Seyschab. Built with
        <NuxtLink target="_blank" to="https://nuxt.com">Nuxt</NuxtLink>.
      </p>
    </AppContainer>
  </footer>
</template>

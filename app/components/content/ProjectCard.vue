<script setup lang="ts">
const props = defineProps<{
  project: {
    path: string
    name: string
    description: string
    startDate: string
    endDate?: string
    liveUrl?: string
    repoUrl?: string
    repoStars?: number
    tags: string[]
  }
}>()

/**
 * Formats a year or year span for display.
 * - Ongoing (no endDate): "2024-present"
 * - Same year: "2024"
 * - Different years: "2023-2025"
 */
const displayPeriod = computed(() => {
  const startYear = props.project.startDate.slice(0, 4)
  if (!props.project.endDate) return `${startYear}-present`
  const endYear = props.project.endDate.slice(0, 4)
  return startYear === endYear ? startYear : `${startYear}-${endYear}`
})
</script>

<template>
  <AppCard class="relative cursor-pointer" gap="2" interactive>
    <div class="flex items-center gap-4 text-xs">
      <span class="flex items-center gap-1 font-mono text-text-dim">
        <Icon name="ph:calendar-blank" :size="14" />
        {{ displayPeriod }}
      </span>
      <span v-if="project.repoStars && project.repoStars > 0" class="flex items-center gap-1 font-mono text-text-dim">
        <Icon name="ph:star" :size="14" />
        {{ project.repoStars }}
      </span>
    </div>
    <h3>
      <NuxtLink class="card-link flex items-center gap-2" :to="project.path">
        <Icon class="shrink-0" name="ph:folder-open" :size="18" />
        {{ project.name }}
      </NuxtLink>
    </h3>
    <div v-if="project.tags.length" class="flex flex-wrap gap-1.5">
      <AppTag v-for="tag in project.tags" :key="tag" :label="tag" />
    </div>
    <p class="text-sm">
      {{ project.description }}
    </p>
    <div v-if="project.liveUrl || project.repoUrl" class="relative z-10 mt-1 flex gap-4">
      <NuxtLink
        v-if="project.liveUrl"
        class="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover"
        target="_blank"
        :to="project.liveUrl"
      >
        <Icon name="ph:arrow-square-out" :size="16" />
        Live
      </NuxtLink>
      <NuxtLink
        v-if="project.repoUrl"
        class="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover"
        target="_blank"
        :to="project.repoUrl"
      >
        <Icon name="ph:github-logo" :size="16" />
        Repo
      </NuxtLink>
    </div>
  </AppCard>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.card-link {
  @apply text-inherit no-underline;
}

.card-link::after {
  @apply absolute inset-0;
  content: '';
}
</style>

<script setup lang="ts">
defineProps<{
  project: {
    path: string
    name: string
    description: string
    liveUrl?: string
    repoStars?: number
    tags: string[]
  }
}>()
</script>

<template>
  <AppCard class="relative cursor-pointer" interactive>
    <div class="flex items-center justify-between">
      <h3 class="text-base">
        <NuxtLink class="card-link flex items-center gap-2" :to="project.path">
          <Icon name="ph:folder-open" :size="18" />
          {{ project.name }}
        </NuxtLink>
      </h3>
      <span v-if="project.repoStars" class="flex items-center gap-1 font-mono text-xs text-text-dim">
        <Icon name="ph:star" :size="14" />
        {{ project.repoStars }}
      </span>
    </div>
    <p class="text-sm">
      {{ project.description }}
    </p>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-1.5">
        <AppTag v-for="tag in project.tags" :key="tag" :label="tag" />
      </div>
      <NuxtLink
        v-if="project.liveUrl"
        class="relative z-10 flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover"
        target="_blank"
        :to="project.liveUrl"
      >
        <Icon name="ph:arrow-square-out" :size="14" />
        Live
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

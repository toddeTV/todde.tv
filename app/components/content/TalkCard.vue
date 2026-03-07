<script setup lang="ts">
const props = defineProps<{
  talk: {
    path: string
    date: string
    title: string
    event: string
    location?: string
    slidesUrl?: string
    videoUrl?: string
    repoUrl?: string
  }
}>()

const today = useTodayDate()
const isUpcoming = computed(() => props.talk.date >= today.value)
</script>

<template>
  <AppCard class="relative cursor-pointer" gap="2" interactive>
    <div class="flex items-center gap-4 text-xs">
      <time class="flex items-center gap-1 font-mono text-text-dim">
        <Icon name="ph:calendar-blank" :size="14" />
        {{ talk.date }}
      </time>
      <span v-if="talk.location" class="flex items-center gap-1 text-text-dim">
        <Icon name="ph:map-pin" :size="14" />
        {{ talk.location }}
      </span>
      <span
        v-if="isUpcoming"
        class="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-accent uppercase"
      >
        Upcoming
      </span>
    </div>
    <h3>
      <NuxtLink class="card-link" :to="talk.path">
        {{ talk.title }}
      </NuxtLink>
    </h3>
    <p class="text-sm">
      {{ talk.event }}
    </p>
    <div v-if="talk.slidesUrl || talk.videoUrl || talk.repoUrl" class="relative z-10 mt-1 flex gap-4">
      <NuxtLink
        v-if="talk.slidesUrl"
        class="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover"
        target="_blank"
        :to="talk.slidesUrl"
      >
        <Icon name="ph:presentation" :size="16" />
        Slides
      </NuxtLink>
      <NuxtLink
        v-if="talk.videoUrl"
        class="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover"
        target="_blank"
        :to="talk.videoUrl"
      >
        <Icon name="ph:play-circle" :size="16" />
        Video
      </NuxtLink>
      <NuxtLink
        v-if="talk.repoUrl"
        class="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover"
        target="_blank"
        :to="talk.repoUrl"
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

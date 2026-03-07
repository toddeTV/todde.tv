<script setup lang="ts">
useSeoMeta({
  title: 'Talks - Thorsten Seyschab',
  description: 'Conference talks and speaking engagements by Thorsten Seyschab (toddeTV) on '
    + 'tech and life topics - from Vue.js, Nuxt, and Vite plugins to 3D on the web.',
})

defineOgImageComponent('Talk', {
  title: 'Talks',
  event: 'Conference talks & speaking engagements',
})

const { data: allTalks } = await useAsyncData('talks', () =>
  queryCollection('talks').order('date', 'DESC').all(),
)

const today = useTodayDate()

const upcomingTalks = computed(() =>
  (allTalks.value ?? []).filter(t => t.date >= today.value).sort((a, b) => a.date.localeCompare(b.date)),
)

const pastTalks = computed(() =>
  (allTalks.value ?? []).filter(t => t.date < today.value),
)

const years = computed(() => {
  const grouped = new Map<string, typeof pastTalks.value>()
  for (const talk of pastTalks.value) {
    const year = talk.date.slice(0, 4)
    if (!grouped.has(year)) grouped.set(year, [])
    grouped.get(year)!.push(talk)
  }
  return Array.from(grouped.entries())
})
</script>

<template>
  <div>
    <AppPageHeader
      description="I speak at conferences and meetups about tech and non-tech topics - from Vue.js,
          Nuxt, and Vite plugins to 3D on the web and beyond. Here's a chronological list of my talks."
      title="Talks"
    >
      <p class="mt-3 text-xs text-text-dim italic">
        This is a curated selection. Some engagements are not listed due to NDAs or other
        confidentiality agreements.
      </p>
    </AppPageHeader>

    <AppSeparator v-if="upcomingTalks.length" />

    <AppSection v-if="upcomingTalks.length" spacing="md">
      <h2 class="mb-6 font-mono text-lg font-medium text-accent">
        Upcoming
      </h2>
      <div class="flex flex-col gap-4">
        <TalkCard v-for="talk in upcomingTalks" :key="talk.path" :talk="talk" />
      </div>
    </AppSection>

    <template v-for="[year, yearTalks] in years" :key="year">
      <AppSeparator />
      <AppSection spacing="md">
        <h2 class="mb-6 font-mono text-lg font-medium text-accent">
          {{ year }}
        </h2>
        <div class="flex flex-col gap-4">
          <TalkCard v-for="talk in yearTalks" :key="talk.path" :talk="talk" />
        </div>
      </AppSection>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: talk } = await useAsyncData(`talk-${route.params.slug}`, () =>
  queryCollection('talks').path(`/talks/${route.params.slug}`).first(),
)

if (!talk.value) {
  throw createError({ statusCode: 404, statusMessage: 'Talk not found' })
}

const today = useTodayDate()
const isUpcoming = computed(() => talk.value!.date >= today.value)

useSeoMeta({
  title: talk.value.title,
  description: talk.value.description || `${talk.value.title} at ${talk.value.event} in ${talk.value.location}.`,
})

defineOgImageComponent('Talk', {
  title: talk.value.title,
  event: talk.value.event,
  date: talk.value.date,
  location: talk.value.location,
})
</script>

<template>
  <div v-if="talk">
    <AppSection>
      <AppBackLink label="All Talks" to="/talks" />

      <div class="mb-4 flex items-center gap-4 text-sm text-text-dim">
        <time class="flex items-center gap-1 font-mono">
          <Icon name="ph:calendar-blank" :size="14" />
          {{ talk.date }}
        </time>
        <span class="flex items-center gap-1">
          <Icon name="ph:map-pin" :size="14" />
          {{ talk.location }}
        </span>
        <span
          v-if="isUpcoming"
          class="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold tracking-wider text-accent uppercase"
        >
          Upcoming
        </span>
      </div>

      <h1 class="mb-3">
        {{ talk.title }}
      </h1>
      <p class="mb-6 text-lg font-medium text-accent">
        {{ talk.event }}
      </p>

      <div v-if="talk.description" class="mb-8 text-lg leading-relaxed text-text-muted">
        <ContentRenderer :value="talk" />
      </div>

      <div v-if="talk.slidesUrl || talk.videoUrl || talk.repoUrl" class="flex flex-wrap gap-3">
        <AppButton
          v-if="talk.slidesUrl"
          :href="talk.slidesUrl"
          icon="ph:presentation"
          label="View Slides"
        />
        <AppButton
          v-if="talk.videoUrl"
          :href="talk.videoUrl"
          icon="ph:play-circle"
          label="Watch Video"
        />
        <AppButton
          v-if="talk.repoUrl"
          :href="talk.repoUrl"
          icon="ph:github-logo"
          label="Source Code"
        />
      </div>
    </AppSection>

    <AppSeparator v-if="talk.testimonials?.length" />
    <AppSection v-if="talk.testimonials?.length" heading="Testimonials">
      <TestimonialCarousel :testimonials="talk.testimonials!" />
    </AppSection>
  </div>
</template>

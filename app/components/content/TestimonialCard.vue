<script setup lang="ts">
const props = defineProps<{
  testimonial: {
    quote: string
    author: string
    role: string
    linkTo?: string
  }
}>()

const linkTo = computed(() => props.testimonial.linkTo)
</script>

<template>
  <AppCard :full-height="true" :to="linkTo">
    <Icon class="text-accent" name="ph:quotes" :size="24" />
    <p class="flex-1 leading-relaxed">
      {{ testimonial.quote }}
    </p>
    <div>
      <span class="font-semibold text-text">{{ testimonial.author }}</span>
      <span class="text-text-dim"> · {{ testimonial.role }}</span>
    </div>
  </AppCard>
</template>

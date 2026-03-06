<script setup lang="ts">
/**
 * Reusable surface card with border and hover state.
 * Renders as a NuxtLink when `to` or `href` is provided, otherwise a plain div.
 */
const props = defineProps<{
  /** Internal route path — makes card a clickable link */
  to?: string
  /** External URL — makes card an anchor link */
  href?: string
  /** Vertical gap between card children. Default: '3' */
  gap?: '2' | '3'
  /** Force full height (for grid/carousel layouts) */
  fullHeight?: boolean
  /** Enable hover styling on a static (non-link) card. Used with the stretched link pattern. */
  interactive?: boolean
}>()

/** Resolved link destination for NuxtLink. */
const linkTarget = computed(() => props.to ?? props.href)

/** Extra attributes applied only for external links. */
const linkAttrs = computed(() => (props.href && !props.to ? { target: '_blank' } : {}))

/** Maps gap prop to static Tailwind class literals. */
const gapClass = computed(() => {
  const map: Record<string, string> = { 2: 'gap-2', 3: 'gap-3' }
  return map[props.gap ?? '3']
})
</script>

<template>
  <NuxtLink
    v-if="to || href"
    class="app-card app-card-base app-card-hover p-4 sm:p-6"
    :class="[gapClass, { 'h-full': fullHeight }]"
    :to="linkTarget"
    v-bind="linkAttrs"
  >
    <slot />
  </NuxtLink>
  <div
    v-else
    class="app-card-base p-4 sm:p-6"
    :class="[
      interactive ? 'app-card-interactive app-card-hover' : '',
      gapClass,
      { 'h-full': fullHeight },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.app-card-base {
  @apply bg-surface border border-border rounded-lg flex flex-col;
}

.app-card-hover {
  @apply transition-colors hover:border-accent hover:bg-surface-hover;
}

.app-card {
  @apply no-underline text-inherit;
}
</style>

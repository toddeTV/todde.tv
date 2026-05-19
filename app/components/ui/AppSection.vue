<script setup lang="ts">
/**
 * Page section wrapper with consistent container and optional heading.
 */
defineProps<{
  /** Section heading text (renders as H2) */
  heading?: string
  /** Padding size: 'lg' = py-10 sm:py-16 (default), 'md' = py-6 sm:py-10, 'bottom' = pb-10 sm:pb-16 only */
  spacing?: 'lg' | 'md' | 'bottom'
}>()

defineSlots<{
  /** Main section body content */
  'default'(): unknown
  /** Optional headline content replacing the heading prop output */
  'headline'(): unknown
  /** Optional header action/content aligned to the right */
  'headline-right'(): unknown
}>()

const attrs = useAttrs()
</script>

<template>
  <section
    v-bind="attrs"
    :class="[
      'scroll-mt-11',
      spacing === 'md' ? 'py-6 sm:py-10'
      : spacing === 'bottom' ? 'pb-10 sm:pb-16'
        : 'py-10 sm:py-16',
    ]"
  >
    <AppContainer>
      <div
        v-if="heading || $slots.headline || $slots['headline-right']"
        :class="[
          'mb-4 flex items-center gap-4 sm:mb-6',
          heading || $slots.headline ? 'justify-between' : 'justify-end',
        ]"
      >
        <div v-if="heading || $slots.headline" class="min-w-0">
          <slot name="headline">
            <h2
              v-if="heading"
              class="mb-0"
            >
              {{ heading }}
            </h2>
          </slot>
        </div>

        <div v-if="$slots['headline-right']" class="flex shrink-0 items-center">
          <slot name="headline-right" />
        </div>
      </div>

      <slot />
    </AppContainer>
  </section>
</template>

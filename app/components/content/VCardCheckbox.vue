<script setup lang="ts">
/**
 * Styled checkbox for the vCard page. Renders an icon, label, and toggle-style checkbox.
 */
const model = defineModel<boolean>({ default: false })

defineProps<{
  /** Iconify icon name (e.g. "ph:user"). */
  icon: string
  /** Display label next to the checkbox. */
  label: string
}>()
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-3 rounded-lg border border-border
      px-4 py-3 transition-colors duration-200 select-none
      hover:border-accent hover:bg-surface-hover"
  >
    <Icon class="shrink-0 text-text-muted" :name="icon" :size="18" />
    <span class="flex-1 text-sm text-text">{{ label }}</span>
    <input
      v-model="model"
      class="vcard-checkbox shrink-0"
      type="checkbox"
    >
  </label>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.vcard-checkbox {
  @apply h-5 w-5 cursor-pointer appearance-none rounded border border-border bg-surface transition-colors duration-200;
}

.vcard-checkbox:checked {
  @apply border-accent bg-accent;
}

.vcard-checkbox:focus-visible {
  @apply outline-2 outline-offset-2 outline-accent;
}
</style>

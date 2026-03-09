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
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23141416' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.vcard-checkbox:focus-visible {
  @apply outline-2 outline-offset-2 outline-accent;
}
</style>

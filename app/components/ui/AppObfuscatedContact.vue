<script setup lang="ts">
/**
 * Renders contact information (email/phone) with basic bot protection.
 *
 * Queries the socials collection for the first active entry whose URL starts with `mailto:`
 * (for email) or `tel:` (for phone), ordered by ascending `sortOrder`.
 *
 * **Approach:** During SSR/pre-rendering, the text is reversed in the DOM and displayed
 * correctly via CSS `direction: rtl`. Bots parsing raw HTML see garbage. No `mailto:`/`tel:`
 * link exists in the static HTML. After hydration, the component upgrades to a clickable link
 * with the real value.
 */

const props = defineProps<{
  /** Type determines which social to look up (mailto: or tel:). */
  type: 'email' | 'phone'
}>()

const isMounted = ref(false)

const urlPrefix = computed(() =>
  props.type === 'email' ? 'mailto:' : 'tel:',
)

const { data: social } = await useAsyncData(
  `obfuscated-contact-${props.type}`,
  async () => {
    const all = await queryCollection('socials')
      .where('active', '=', true)
      .order('sortOrder', 'ASC')
      .all()
    return (
      all.find(s => s.url.startsWith(urlPrefix.value)) ?? null
    )
  },
)

/** Display value from the social entry's handle field. */
const displayValue = computed(
  () => social.value?.handle ?? '',
)

/** Reversed string for the pre-rendered RTL trick. */
const reversed = computed(() =>
  displayValue.value.split('').reverse().join(''),
)

/** Link href from the social entry's url field. */
const href = computed(() => social.value?.url ?? '')

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <a v-if="isMounted && href" :href="href">{{ displayValue }}</a>
  <span
    v-else-if="displayValue"
    style="direction: rtl; unicode-bidi: bidi-override;"
  >{{ reversed }}</span>
</template>

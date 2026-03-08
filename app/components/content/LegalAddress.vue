<script setup lang="ts">
/**
 * Renders the legal postal address from runtimeConfig.
 * Values are injected via GitHub Variables at build time to keep them out of Git.
 */

const config = useRuntimeConfig()

const street = computed(() => config.public.legalAddressStreet as string)
const city = computed(() => config.public.legalAddressCity as string)
const country = computed(() => config.public.legalAddressCountry as string)

const hasAddress = computed(() => street.value || city.value || country.value)
</script>

<template>
  <address v-if="hasAddress" class="leading-relaxed not-italic">
    <template v-if="street">
      {{ street }}<br>
    </template>
    <template v-if="city">
      {{ city }}<br>
    </template>
    <template v-if="country">
      {{ country }}
    </template>
  </address>
  <p v-else class="text-text-dim italic">
    [Address not configured - set NUXT_PUBLIC_LEGAL_ADDRESS_* environment variables]
  </p>
</template>

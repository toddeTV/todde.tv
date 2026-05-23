import { resolveCloudflareNitroPreset, runNuxtBuild } from './utils/run-nuxt-build'

const nitroPreset = resolveCloudflareNitroPreset(process.env.CLOUDFLARE_NITRO_PRESET)

runNuxtBuild('build', {
  NITRO_PRESET: nitroPreset,
})

console.log(`Built SSR artifact with Nitro preset: ${nitroPreset}`)

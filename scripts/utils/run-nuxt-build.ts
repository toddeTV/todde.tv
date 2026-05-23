import { execFileSync } from 'node:child_process'
import { resolveBuildReleaseMetadata } from '../../server/utils/build-release-metadata'

const cloudflareNitroPresets = [
  'cloudflare_module',
  'cloudflare_pages',
] as const

type CloudflareNitroPreset = typeof cloudflareNitroPresets[number]
type NuxtBuildCommand = 'build' | 'generate'

/** Resolves the shared build-time environment for Nuxt CLI commands. */
function createBuildEnv(extraEnv: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  const buildReleaseMetadata = resolveBuildReleaseMetadata()
  const nodeOptions = [
    process.env.NODE_OPTIONS,
    '--max-old-space-size=8192',
  ].filter(Boolean).join(' ')
  const buildEnv = {
    ...process.env,
    BUILD_RELEASE_COMMIT_SHORT: buildReleaseMetadata.commitShort,
    BUILD_RELEASE_DATE: buildReleaseMetadata.buildDateIso,
    NODE_OPTIONS: nodeOptions,
    ...extraEnv,
  }

  delete buildEnv.VP_COMMAND
  delete buildEnv.VP_PACKAGE_NAME

  return buildEnv
}

/** Runs the Vite+ CLI with repo-safe environment defaults. */
function runVpCommand(args: string[], env: NodeJS.ProcessEnv): void {
  execFileSync(process.env.VP_CLI_BIN ?? 'vp', args, {
    env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  })
}

/** Runs the Nuxt build or generate command with shared build metadata. */
export function runNuxtBuild(command: NuxtBuildCommand, extraEnv: NodeJS.ProcessEnv = {}): void {
  runVpCommand([
    'exec',
    'nuxt',
    command,
  ], createBuildEnv(extraEnv))
}

/** Regenerates and verifies the Cloudflare Pages redirects artifact. */
export function runRedirectArtifactGeneration(): void {
  const buildEnv = createBuildEnv()

  runVpCommand([
    'run',
    'redirects:generate',
  ], buildEnv)

  runVpCommand([
    'run',
    'redirects:check',
  ], buildEnv)
}

/** Resolves the future Cloudflare Nitro preset for SSR worker or pages builds. */
export function resolveCloudflareNitroPreset(value: string | undefined): CloudflareNitroPreset {
  const normalizedValue = value?.trim()

  if (!normalizedValue) {
    return 'cloudflare_pages'
  }

  if (cloudflareNitroPresets.some(preset => preset === normalizedValue)) {
    return normalizedValue as CloudflareNitroPreset
  }

  throw new Error(
    'Invalid CLOUDFLARE_NITRO_PRESET. '
    + `Expected one of ${cloudflareNitroPresets.join(', ')}, got "${normalizedValue}".`,
  )
}

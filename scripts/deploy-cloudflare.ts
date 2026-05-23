import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const DEFAULT_PAGES_PROJECT_NAME = 'todde-tv'
const DEFAULT_ARTIFACT_PATH = '.output/public'
const PROJECT_LOOKUP_TIMEOUT_MS = 60_000
const WRANGLER_PACKAGE = 'wrangler@4.86.0'

const requiredEnvVars = [
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
] as const

interface CloudflarePagesProjectApiResponse {
  errors?: Array<{
    message?: string
  }>
  messages?: Array<{
    message?: string
  }>
  result?: Record<string, unknown>
  success?: boolean
}

/** Verifies that all required Cloudflare credentials exist before deployment. */
function assertRequiredEnvVars(): void {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing ${envVar} in process environment.`)
    }
  }
}

/** Resolves the Pages project name from the environment or repository default. */
function resolveProjectName(): string {
  const projectName = process.env.CLOUDFLARE_PAGES_PROJECT_NAME?.trim() || DEFAULT_PAGES_PROJECT_NAME

  if (projectName.length === 0) {
    throw new Error('CLOUDFLARE_PAGES_PROJECT_NAME resolved to an empty value.')
  }

  return projectName
}

/** Fails fast when the static deployment artifact is missing. */
function assertDeployArtifactExists(artifactPath: string): void {
  if (!existsSync(artifactPath)) {
    throw new Error(
      `Cloudflare Pages artifact is missing at ${artifactPath}. Run \`vp run build:ssg\` first.`,
    )
  }
}

/** Normalizes Cloudflare API error and message payloads into a readable string. */
function formatCloudflareApiMessages(payload: CloudflarePagesProjectApiResponse): string {
  return [
    ...(payload.errors ?? []),
    ...(payload.messages ?? []),
  ]
    .flatMap(item => item.message?.trim() ? [item.message.trim()] : [])
    .join('\n')
}

/** Checks that the configured Pages project exists before calling Wrangler. */
async function assertPagesProjectExists(projectName: string): Promise<void> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!
  const apiToken = process.env.CLOUDFLARE_API_TOKEN!

  let response: Response

  try {
    response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${encodeURIComponent(projectName)}`,
      {
        signal: AbortSignal.timeout(PROJECT_LOOKUP_TIMEOUT_MS),
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    )
  }
  catch (error) {
    if (
      error instanceof Error
      && (error.name === 'AbortError' || error.name === 'TimeoutError')
    ) {
      throw new Error(
        'Cloudflare Pages project lookup timed out after '
        + `${PROJECT_LOOKUP_TIMEOUT_MS}ms for "${projectName}".`,
      )
    }

    throw error
  }

  const responseBody = await response.text()
  let payload: CloudflarePagesProjectApiResponse

  try {
    payload = JSON.parse(responseBody) as CloudflarePagesProjectApiResponse
  }
  catch {
    throw new Error(
      'Cloudflare Pages project lookup returned invalid JSON. '
      + `Response status: ${response.status}.\n${responseBody}`,
    )
  }

  if (!response.ok || payload.success === false || !payload.result) {
    const apiMessages = formatCloudflareApiMessages(payload)

    throw new Error(
      `Cloudflare Pages project lookup failed for "${projectName}". `
      + `Response status: ${response.status}.`
      + (apiMessages.length > 0 ? `\n${apiMessages}` : ''),
    )
  }
}

/** Calls the pinned Wrangler CLI through `vp dlx` with repo-safe defaults. */
function runWranglerDeploy(projectName: string, artifactPath: string, passthroughArgs: string[]): void {
  const deployEnv = {
    ...process.env,
    CLOUDFLARE_PAGES_PROJECT_NAME: projectName,
    WRANGLER_SEND_ERROR_REPORTS: 'false',
    WRANGLER_SEND_METRICS: 'false',
  }

  delete deployEnv.VP_COMMAND
  delete deployEnv.VP_PACKAGE_NAME

  execFileSync(process.env.VP_CLI_BIN ?? 'vp', [
    'dlx',
    WRANGLER_PACKAGE,
    'pages',
    'deploy',
    artifactPath,
    '--project-name',
    projectName,
    ...passthroughArgs,
  ], {
    env: deployEnv,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  })
}

const passthroughArgs = process.argv.slice(2)

if (passthroughArgs.some(arg => arg === '--project-name' || arg === '-p' || arg.startsWith('--project-name='))) {
  throw new Error(
    'Do not pass --project-name to this script. '
    + 'Use CLOUDFLARE_PAGES_PROJECT_NAME instead.',
  )
}

assertRequiredEnvVars()

const projectName = resolveProjectName()
const artifactPath = resolve(process.cwd(), DEFAULT_ARTIFACT_PATH)

assertDeployArtifactExists(artifactPath)
await assertPagesProjectExists(projectName)
runWranglerDeploy(projectName, artifactPath, passthroughArgs)

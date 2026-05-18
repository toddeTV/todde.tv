import { execSync } from 'node:child_process'

const defaultCommitShort = 'unknown'

const buildDateEnvKeys = [
  'BUILD_RELEASE_DATE',
  'NUXT_BUILD_RELEASE_DATE',
]

const commitEnvKeys = [
  'BUILD_RELEASE_COMMIT_SHORT',
  'NUXT_BUILD_RELEASE_COMMIT_SHORT',
  'CF_PAGES_COMMIT_SHA',
  'GITHUB_SHA',
  'CI_COMMIT_SHA',
]

export interface BuildReleaseMetadata {
  buildDateIso: string
  commitShort: string
  releaseLabel: string
}

/** Builds the footer release label from an ISO build date and short commit SHA. */
function createReleaseLabel(buildDateIso: string, commitShort: string): string {
  return `${buildDateIso.replaceAll('-', '.')}+${commitShort}`
}

/** Returns the first non-empty trimmed environment value for the provided keys. */
function getFirstEnvValue(env: NodeJS.ProcessEnv, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = env[key]?.trim()

    if (value) {
      return value
    }
  }

  return undefined
}

/** Normalizes supported date input to an ISO 8601 calendar date. */
function normalizeBuildDateIso(value: string | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  const trimmedValue = value.trim()
  const isoDateMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (isoDateMatch) {
    const parsedIsoDate = new Date(`${trimmedValue}T00:00:00.000Z`)

    if (Number.isNaN(parsedIsoDate.getTime())) {
      return undefined
    }

    const yearPart = isoDateMatch[1]
    const monthPart = isoDateMatch[2]
    const dayPart = isoDateMatch[3]

    if (
      parsedIsoDate.getUTCFullYear() !== Number(yearPart)
      || parsedIsoDate.getUTCMonth() + 1 !== Number(monthPart)
      || parsedIsoDate.getUTCDate() !== Number(dayPart)
    ) {
      return undefined
    }

    return trimmedValue
  }

  const parsedDate = new Date(trimmedValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined
  }

  return parsedDate.toISOString().slice(0, 10)
}

/** Returns the current UTC build date as an ISO 8601 calendar date. */
function getCurrentBuildDateIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Normalizes a commit SHA-like value to a lowercase 7-character short SHA. */
function normalizeCommitShort(value: string | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  const normalizedMatch = value.trim().toLowerCase().match(/[0-9a-f]{7,40}/)

  if (!normalizedMatch) {
    return undefined
  }

  return normalizedMatch[0].slice(0, 7)
}

/** Reads the current Git HEAD and returns a normalized short SHA when available. */
function readGitCommitShort(): string | undefined {
  try {
    return normalizeCommitShort(execSync('git rev-parse --short=7 HEAD', { encoding: 'utf8' }))
  }
  catch {
    return undefined
  }
}

/** Resolve release metadata once at build/config time for footer display. */
export function resolveBuildReleaseMetadata(
  env: NodeJS.ProcessEnv = process.env,
  resolveGitCommitShort: () => string | undefined = readGitCommitShort,
): BuildReleaseMetadata {
  const buildDateIso = normalizeBuildDateIso(getFirstEnvValue(env, buildDateEnvKeys))
    ?? getCurrentBuildDateIso()
  const commitShort = normalizeCommitShort(getFirstEnvValue(env, commitEnvKeys))
    ?? normalizeCommitShort(resolveGitCommitShort())
    ?? defaultCommitShort

  return {
    buildDateIso,
    commitShort,
    releaseLabel: createReleaseLabel(buildDateIso, commitShort),
  }
}

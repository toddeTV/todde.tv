import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

import { runNuxtBuild, runRedirectArtifactGeneration } from '../../scripts/utils/run-nuxt-build'

const outputRoot = resolve(process.cwd(), '.output/public')
const buildLockPath = resolve(process.cwd(), '.integration-static-site-build.lock')
const redirectsOutputPath = resolve(outputRoot, '_redirects')

export const integrationLegalEnv = {
  NUXT_PUBLIC_LEGAL_NAME: 'Integration Test Name',
  NUXT_PUBLIC_LEGAL_OCCUPATION: 'Integration Test Occupation',
  NUXT_PUBLIC_LEGAL_OCCUPATION_DE: 'Integrationstest Beruf',
  NUXT_PUBLIC_LEGAL_EMAIL: 'integration@example.com',
  NUXT_PUBLIC_LEGAL_PHONE: '+49 000 0000000',
  NUXT_PUBLIC_LEGAL_ADDRESS_STREET: 'Integration Street 1',
  NUXT_PUBLIC_LEGAL_ADDRESS_CITY: '01067 Dresden',
  NUXT_PUBLIC_LEGAL_ADDRESS_COUNTRY: 'Germany',
  NUXT_PUBLIC_LEGAL_VAT_ID: 'DE000000000',
} satisfies NodeJS.ProcessEnv

let staticSiteBuilt = false

/** Checks whether the shared integration output already exists and is ready for reuse. */
function hasPreparedStaticSiteOutput(): boolean {
  return existsSync(outputRoot) && existsSync(redirectsOutputPath)
}

/** Normalizes a route path to the generated directory path below `.output/public`. */
function resolveGeneratedRouteDirectory(routePath: string): string {
  const normalizedPath = routePath.trim().replace(/^\/|\/$/g, '')

  return normalizedPath || '.'
}

/** Sleeps synchronously for a short interval while another test worker finishes the build. */
function waitForMilliseconds(milliseconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

/** Waits for a concurrent static-site build to finish and verifies the shared output exists. */
function waitForConcurrentStaticSiteBuild(): void {
  const waitDeadline = Date.now() + 600_000

  while (existsSync(buildLockPath)) {
    if (Date.now() > waitDeadline) {
      throw new Error('Timed out waiting for the shared integration static-site build to finish.')
    }

    waitForMilliseconds(100)
  }

  if (!hasPreparedStaticSiteOutput()) {
    throw new Error('Shared integration static-site build lock cleared without generated output.')
  }
}

/** Builds the shared static-site output from scratch for integration tests. */
function buildStaticSiteOutput(): void {
  rmSync(resolve(process.cwd(), '.output'), {
    recursive: true,
    force: true,
  })
  runNuxtBuild('generate', integrationLegalEnv)
  runRedirectArtifactGeneration()
}

/**
 * Builds static site output once for integration tests and returns the output root.
 *
 * @returns Generated public output directory path.
 */
export function ensureStaticSiteBuild(): string {
  if (staticSiteBuilt || hasPreparedStaticSiteOutput()) {
    staticSiteBuilt = true

    return outputRoot
  }

  try {
    mkdirSync(buildLockPath)
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }

    waitForConcurrentStaticSiteBuild()
    staticSiteBuilt = true

    return outputRoot
  }

  try {
    buildStaticSiteOutput()
    staticSiteBuilt = true
  }
  finally {
    rmSync(buildLockPath, {
      recursive: true,
      force: true,
    })
  }

  return outputRoot
}

/** Forces a fresh shared static-site build before the integration test run starts. */
export function rebuildStaticSiteBuild(): string {
  try {
    mkdirSync(buildLockPath)
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }

    waitForConcurrentStaticSiteBuild()
    staticSiteBuilt = true

    return outputRoot
  }

  try {
    buildStaticSiteOutput()
    staticSiteBuilt = true
  }
  finally {
    rmSync(buildLockPath, {
      recursive: true,
      force: true,
    })
  }

  return outputRoot
}

/**
 * Resolves a path inside the generated public output directory.
 *
 * @param relativePath Path relative to `.output/public`.
 * @returns Absolute path to generated output file.
 */
export function generatedOutputPath(relativePath: string): string {
  return resolve(outputRoot, relativePath)
}

/**
 * Resolves the generated HTML path for a prerendered route.
 *
 * @param routePath Route path such as `/`, `/projects`, or `/projects/example`.
 * @returns Absolute path to the generated route HTML file.
 */
export function generatedRouteOutputPath(routePath: string): string {
  return generatedOutputPath(resolveGeneratedRouteDirectory(routePath) + '/index.html')
}

/**
 * Checks whether a generated output file exists.
 *
 * @param relativePath Path relative to `.output/public`.
 * @returns `true` when the generated file exists.
 */
export function hasGeneratedOutput(relativePath: string): boolean {
  return existsSync(generatedOutputPath(relativePath))
}

/**
 * Checks whether a prerendered route HTML file exists.
 *
 * @param routePath Route path such as `/`, `/projects`, or `/projects/example`.
 * @returns `true` when the prerendered route HTML exists.
 */
export function hasGeneratedRoute(routePath: string): boolean {
  return existsSync(generatedRouteOutputPath(routePath))
}

/**
 * Reads a generated output file as UTF-8 text.
 *
 * @param relativePath Path relative to `.output/public`.
 * @returns UTF-8 contents of generated output file.
 */
export function readGeneratedOutput(relativePath: string): string {
  return readFileSync(generatedOutputPath(relativePath), 'utf8')
}

/**
 * Reads the generated HTML for a prerendered route as UTF-8 text.
 *
 * @param routePath Route path such as `/`, `/projects`, or `/projects/example`.
 * @returns UTF-8 contents of the prerendered route HTML file.
 */
export function readGeneratedRoute(routePath: string): string {
  return readFileSync(generatedRouteOutputPath(routePath), 'utf8')
}

import { existsSync, readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

import { runNuxtBuild, runRedirectArtifactGeneration } from '../../scripts/utils/run-nuxt-build'

const outputRoot = resolve(process.cwd(), '.output/public')

const integrationLegalEnv = {
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

/** Normalizes a route path to the generated directory path below `.output/public`. */
function resolveGeneratedRouteDirectory(routePath: string): string {
  const normalizedPath = routePath.trim().replace(/^\/|\/$/g, '')

  return normalizedPath || '.'
}

/**
 * Builds static site output once for integration tests and returns the output root.
 *
 * @returns Generated public output directory path.
 */
export function ensureStaticSiteBuild(): string {
  if (!staticSiteBuilt) {
    rmSync(resolve(process.cwd(), '.output'), {
      recursive: true,
      force: true,
    })
    runNuxtBuild('generate', integrationLegalEnv)
    runRedirectArtifactGeneration()
    staticSiteBuilt = true
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

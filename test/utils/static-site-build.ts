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
 * Checks whether a generated output file exists.
 *
 * @param relativePath Path relative to `.output/public`.
 * @returns `true` when the generated file exists.
 */
export function hasGeneratedOutput(relativePath: string): boolean {
  return existsSync(generatedOutputPath(relativePath))
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

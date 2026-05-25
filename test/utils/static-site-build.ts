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

export function generatedOutputPath(relativePath: string): string {
  return resolve(outputRoot, relativePath)
}

export function hasGeneratedOutput(relativePath: string): boolean {
  return existsSync(generatedOutputPath(relativePath))
}

export function readGeneratedOutput(relativePath: string): string {
  return readFileSync(generatedOutputPath(relativePath), 'utf8')
}

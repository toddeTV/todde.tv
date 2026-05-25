import { beforeAll, describe, expect, it } from 'vite-plus/test'

import {
  ensureStaticSiteBuild,
  integrationLegalEnv,
  readGeneratedRoute,
} from '../utils/static-site-build'

const expectedLegalValues = [
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_NAME,
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_OCCUPATION,
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_OCCUPATION_DE,
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_EMAIL,
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_PHONE,
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_ADDRESS_STREET,
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_ADDRESS_CITY,
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_ADDRESS_COUNTRY,
  integrationLegalEnv.NUXT_PUBLIC_LEGAL_VAT_ID,
]

describe('prerendered legal data', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('renders the integration legal data on the legal notice page', () => {
    const legalNoticeHtml = readGeneratedRoute('/legal-notice')

    for (const expectedLegalValue of expectedLegalValues) {
      expect(legalNoticeHtml).toContain(expectedLegalValue)
    }
  })

  it('renders the integration legal data on the privacy policy page', () => {
    const privacyPolicyHtml = readGeneratedRoute('/privacy-policy')

    for (const expectedLegalValue of expectedLegalValues) {
      expect(privacyPolicyHtml).toContain(expectedLegalValue)
    }
  })
})

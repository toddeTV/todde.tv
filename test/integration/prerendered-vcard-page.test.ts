import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { extractCanonicalHref, extractMetaContent, extractTitle } from '../utils/html-head'
import { ensureStaticSiteBuild, readGeneratedRoute } from '../utils/static-site-build'

describe('prerendered vCard page', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('renders noindex metadata for the vCard page', () => {
    const vCardHtml = readGeneratedRoute('/vcard')

    expect(extractTitle(vCardHtml)).toBe('vCard | Thorsten Seyschab')
    expect(extractMetaContent(vCardHtml, 'name', 'description')).toBe(
      'Generate a QR code contact card for Thorsten Seyschab.',
    )
    expect(extractMetaContent(vCardHtml, 'name', 'robots')).toBe('noindex, nofollow')
    expect(extractMetaContent(vCardHtml, 'property', 'og:title')).toBe('vCard | Thorsten Seyschab')
    expect(extractMetaContent(vCardHtml, 'property', 'og:description')).toBe(
      'Generate a QR code contact card for Thorsten Seyschab.',
    )
    expect(extractCanonicalHref(vCardHtml)).toBe('https://todde.tv/vcard')
  })

  it('renders the prerendered QR placeholder and contact toggle groups', () => {
    const vCardHtml = readGeneratedRoute('/vcard')

    expect(vCardHtml).toContain('Contact Card - vcard')
    expect(vCardHtml).toContain('Scan the QR code to save the contact.')
    expect(vCardHtml).toContain('Generating QR code...')
    expect(vCardHtml).toContain('Contact Info')
    expect(vCardHtml).toContain('Communication')
    expect(vCardHtml).toContain('Social Profiles')
  })

  it('renders representative enabled and optional contact values', () => {
    const vCardHtml = readGeneratedRoute('/vcard')
    const vCardCheckboxInputs
      = vCardHtml.match(/<input\b[^>]*class\s*=\s*["'][^"']*\bvcard-checkbox\b[^"']*["'][^>]*>/g) ?? []
    const checkedVCardCheckboxInputs = vCardCheckboxInputs.filter(inputTag => /\bchecked\b/.test(inputTag))
    const uncheckedVCardCheckboxInputs = vCardCheckboxInputs.filter(inputTag => !/\bchecked\b/.test(inputTag))

    expect(vCardHtml).toContain('Name (Thorsten Seyschab)')
    expect(vCardHtml).toContain('Handle (@toddeTV)')
    expect(vCardHtml).toContain('Website (todde.tv)')
    expect(vCardHtml).toContain('Email (hello@todde.tv)')
    expect(vCardHtml).toContain('Phone (+49 176 91404834)')
    expect(vCardHtml).toContain('LinkedIn (in/toddetv)')
    expect(vCardHtml).toContain('GitHub (@toddeTV)')
    expect(vCardHtml).toContain('Bluesky (@todde.tv)')
    expect(vCardHtml).toContain('Twitch (@toddeTV)')
    expect(checkedVCardCheckboxInputs).toHaveLength(6)
    expect(uncheckedVCardCheckboxInputs).toHaveLength(5)
  })
})

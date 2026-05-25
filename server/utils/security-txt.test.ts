import { describe, expect, it } from 'vite-plus/test'
import {
  buildSecurityTxtContent,
  createSecurityTxtExpires,
  defaultSecurityTxtLifetimeDays,
} from './security-txt'

describe('security txt utilities', () => {
  it('creates an RFC 3339 expires value within the default lifetime', () => {
    const now = new Date('2026-05-10T12:34:56.000Z')

    expect(defaultSecurityTxtLifetimeDays).toBe(180)
    expect(createSecurityTxtExpires(now)).toBe('2026-11-06T12:34:56.000Z')
  })

  it('renders required security.txt fields', () => {
    const content = buildSecurityTxtContent({
      canonicalUrl: 'https://todde.tv/.well-known/security.txt',
      contact: 'mailto:hello@todde.tv',
      preferredLanguages: [
        'en',
        'de',
      ],
    }, new Date('2026-05-10T12:34:56.000Z'))

    expect(content).toBe([
      'Contact: mailto:hello@todde.tv',
      'Expires: 2026-11-06T12:34:56.000Z',
      'Canonical: https://todde.tv/.well-known/security.txt',
      'Preferred-Languages: en, de',
      '',
    ].join('\n'))
  })

  it('renders the optional policy field when configured', () => {
    const content = buildSecurityTxtContent({
      canonicalUrl: 'https://todde.tv/.well-known/security.txt',
      contact: 'mailto:hello@todde.tv',
      policyUrl: 'https://todde.tv/legal-notice',
      preferredLanguages: [
        'en',
      ],
    }, new Date('2026-05-10T12:34:56.000Z'))

    expect(content).toContain('Policy: https://todde.tv/legal-notice')
  })
})

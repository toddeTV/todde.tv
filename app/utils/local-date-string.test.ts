import { describe, expect, it } from 'vite-plus/test'

import { localDateString } from './local-date-string'

describe('localDateString', () => {
  it('zero-pads month and day values', () => {
    expect(localDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('keeps double-digit month and day values unchanged', () => {
    expect(localDateString(new Date(2026, 10, 15))).toBe('2026-11-15')
  })

  it('handles leap-day dates', () => {
    expect(localDateString(new Date(2024, 1, 29))).toBe('2024-02-29')
  })
})

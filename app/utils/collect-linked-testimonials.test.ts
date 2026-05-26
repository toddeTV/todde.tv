import { describe, expect, it } from 'vite-plus/test'

import { collectLinkedTestimonials } from './collect-linked-testimonials'

describe('collectLinkedTestimonials', () => {
  it('merges project and talk testimonials in descending date order', () => {
    const testimonials = collectLinkedTestimonials(
      [
        {
          path: '/projects/alpha',
          startDate: '2024-01-01',
          endDate: '2024-03-01',
          testimonials: [
            { quote: 'Project later', author: 'A', role: 'Role A' },
          ],
        },
        {
          path: '/projects/beta',
          startDate: '2023-11-01',
          testimonials: [
            { quote: 'Project ongoing', author: 'B', role: 'Role B' },
          ],
        },
      ],
      [
        {
          path: '/talks/gamma',
          date: '2024-02-15',
          testimonials: [
            { quote: 'Talk middle', author: 'C', role: 'Role C' },
          ],
        },
      ],
    )

    expect(testimonials).toEqual([
      { quote: 'Project later', author: 'A', role: 'Role A', linkTo: '/projects/alpha' },
      { quote: 'Talk middle', author: 'C', role: 'Role C', linkTo: '/talks/gamma' },
      { quote: 'Project ongoing', author: 'B', role: 'Role B', linkTo: '/projects/beta' },
    ])
  })

  it('falls back to project start date and skips empty testimonial groups', () => {
    const testimonials = collectLinkedTestimonials(
      [
        {
          path: '/projects/alpha',
          startDate: '2024-01-01',
          endDate: null,
          testimonials: null,
        },
        {
          path: '/projects/beta',
          startDate: '2024-04-01',
          testimonials: [
            { quote: 'Only item', author: 'A', role: 'Role A' },
          ],
        },
      ],
      [
        {
          path: '/talks/empty',
          date: '2024-05-01',
          testimonials: [],
        },
      ],
    )

    expect(testimonials).toEqual([
      { quote: 'Only item', author: 'A', role: 'Role A', linkTo: '/projects/beta' },
    ])
  })

  it('does not leak temporary sort metadata into the result', () => {
    const [testimonial] = collectLinkedTestimonials(
      [
        {
          path: '/projects/alpha',
          startDate: '2024-01-01',
          testimonials: [
            { quote: 'Quoted', author: 'A', role: 'Role A' },
          ],
        },
      ],
      [],
    )

    expect(testimonial).not.toHaveProperty('_sortDate')
  })
})

export interface TestimonialEntry {
  quote: string
  author: string
  role: string
}

export interface LinkedTestimonial extends TestimonialEntry {
  linkTo: string
}

export interface ProjectTestimonialsSource<TTestimonial extends TestimonialEntry = TestimonialEntry> {
  path: string
  startDate: string
  endDate?: string | null
  testimonials?: readonly TTestimonial[] | null
}

export interface TalkTestimonialsSource<TTestimonial extends TestimonialEntry = TestimonialEntry> {
  path: string
  date: string
  testimonials?: readonly TTestimonial[] | null
}

/** Merge project and talk testimonials into one newest-first linked list. */
export function collectLinkedTestimonials<TTestimonial extends TestimonialEntry>(
  projects: readonly ProjectTestimonialsSource<TTestimonial>[],
  talks: readonly TalkTestimonialsSource<TTestimonial>[],
): LinkedTestimonial[] {
  const result: (LinkedTestimonial & { _sortDate: string })[] = []

  for (const project of projects) {
    const sortDate = project.endDate ?? project.startDate
    for (const testimonial of project.testimonials ?? []) {
      result.push({ ...testimonial, linkTo: project.path, _sortDate: sortDate })
    }
  }

  for (const talk of talks) {
    for (const testimonial of talk.testimonials ?? []) {
      result.push({ ...testimonial, linkTo: talk.path, _sortDate: talk.date })
    }
  }

  result.sort((a, b) => b._sortDate.localeCompare(a._sortDate))

  return result.map(({ _sortDate: _ignored, ...rest }) => rest)
}

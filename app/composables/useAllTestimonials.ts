export interface LinkedTestimonial {
  quote: string
  author: string
  role: string
  linkTo: string
}

/**
 * Aggregates testimonials from projects and talks, sorted newest first.
 * Uses talk date or project endDate/startDate for ordering.
 */
export function useAllTestimonials() {
  return useAsyncData('all-testimonials', async () => {
    const [projects, talks] = await Promise.all([
      queryCollection('projects').all(),
      queryCollection('talks').all(),
    ])

    const result: (LinkedTestimonial & { _sortDate: string })[] = []

    for (const p of projects) {
      const sortDate = p.endDate ?? p.startDate
      for (const t of p.testimonials ?? []) {
        result.push({ ...t, linkTo: p.path, _sortDate: sortDate })
      }
    }

    for (const talk of talks) {
      for (const t of talk.testimonials ?? []) {
        result.push({ ...t, linkTo: talk.path, _sortDate: talk.date })
      }
    }

    result.sort((a, b) => b._sortDate.localeCompare(a._sortDate))

    return result.map(({ _sortDate: _, ...rest }) => rest)
  })
}

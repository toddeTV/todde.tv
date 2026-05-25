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

    return collectLinkedTestimonials(projects, talks)
  })
}

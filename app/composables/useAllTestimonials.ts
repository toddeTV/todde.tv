export interface LinkedTestimonial {
  quote: string
  author: string
  role: string
  linkTo: string
}

export function useAllTestimonials() {
  return useAsyncData('all-testimonials', async () => {
    const [clients, projects, talks] = await Promise.all([
      queryCollection('clients').all(),
      queryCollection('projects').all(),
      queryCollection('talks').all(),
    ])

    const result: LinkedTestimonial[] = []

    for (const p of clients) {
      for (const t of p.testimonials ?? []) {
        result.push({ ...t, linkTo: p.path })
      }
    }

    for (const p of projects) {
      for (const t of p.testimonials ?? []) {
        result.push({ ...t, linkTo: p.path })
      }
    }

    for (const talk of talks) {
      for (const t of talk.testimonials ?? []) {
        result.push({ ...t, linkTo: talk.path })
      }
    }

    return result
  })
}

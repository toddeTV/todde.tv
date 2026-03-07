/**
 * Fetches all projects and returns them sorted by recency.
 * Sort order: ongoing first, then by endDate, startDate, and stars.
 * @param limit - Optional max number of projects to return.
 */
export function useSortedProjects(limit?: number) {
  const key = limit ? `sorted-projects-${limit}` : 'sorted-projects'

  return useAsyncData(key, async () => {
    const projects = await queryCollection('projects').all()
    const sorted = projects.sort((a, b) => {
      // 1. Ongoing (no endDate) before completed
      const aOngoing = a.endDate == null
      const bOngoing = b.endDate == null
      if (aOngoing !== bOngoing) return aOngoing ? -1 : 1

      // 2. Within completed: newest endDate first
      if (!aOngoing && !bOngoing) {
        const endCmp = b.endDate!.localeCompare(a.endDate!)
        if (endCmp !== 0) return endCmp
      }

      // 3. Newest startDate first
      const startCmp = b.startDate.localeCompare(a.startDate)
      if (startCmp !== 0) return startCmp

      // 4. More stars first
      return (b.repoStars ?? 0) - (a.repoStars ?? 0)
    })
    return limit ? sorted.slice(0, limit) : sorted
  })
}

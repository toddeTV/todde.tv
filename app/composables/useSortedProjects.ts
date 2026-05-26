/**
 * Fetches all projects and returns them sorted by recency.
 * Sort order: ongoing first, then by endDate, startDate, and stars.
 * @param limit - Optional max number of projects to return.
 */
export function useSortedProjects(limit?: number) {
  const key = limit ? `sorted-projects-${limit}` : 'sorted-projects'

  return useAsyncData(key, async () => {
    const projects = await queryCollection('projects').all()
    return sortProjectsByRecency(projects, limit)
  })
}

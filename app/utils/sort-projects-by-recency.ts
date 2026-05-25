export interface ProjectRecencySortable {
  startDate: string
  endDate?: string | null
  repoStars?: number | null
}

/** Sort projects by current project rules and optionally cap the result length. */
export function sortProjectsByRecency<TProject extends ProjectRecencySortable>(
  projects: readonly TProject[],
  limit?: number,
): TProject[] {
  const sorted = [...projects].sort((a, b) => {
    const aOngoing = a.endDate == null
    const bOngoing = b.endDate == null
    if (aOngoing !== bOngoing) return aOngoing ? -1 : 1

    if (!aOngoing && !bOngoing) {
      const endCompare = b.endDate!.localeCompare(a.endDate!)
      if (endCompare !== 0) return endCompare
    }

    const startCompare = b.startDate.localeCompare(a.startDate)
    if (startCompare !== 0) return startCompare

    return (b.repoStars ?? 0) - (a.repoStars ?? 0)
  })

  return limit ? sorted.slice(0, limit) : sorted
}

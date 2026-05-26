import { describe, expect, it } from 'vite-plus/test'

import { sortProjectsByRecency } from './sort-projects-by-recency'

describe('sortProjectsByRecency', () => {
  it('puts ongoing projects before completed ones', () => {
    const projects = sortProjectsByRecency([
      { id: 'completed', startDate: '2024-01-01', endDate: '2024-02-01', repoStars: 10 },
      { id: 'ongoing', startDate: '2023-01-01', endDate: null, repoStars: 0 },
    ])

    expect(projects.map(project => project.id)).toEqual(['ongoing', 'completed'])
  })

  it('sorts completed projects by end date, then start date, then star count', () => {
    const projects = sortProjectsByRecency([
      { id: 'stars-low', startDate: '2024-05-01', endDate: '2024-08-01', repoStars: 4 },
      { id: 'older-end', startDate: '2024-06-01', endDate: '2024-07-01', repoStars: 100 },
      { id: 'stars-high', startDate: '2024-05-01', endDate: '2024-08-01', repoStars: 8 },
      { id: 'newer-start', startDate: '2024-06-01', endDate: '2024-08-01', repoStars: 1 },
    ])

    expect(projects.map(project => project.id)).toEqual([
      'newer-start',
      'stars-high',
      'stars-low',
      'older-end',
    ])
  })

  it('returns a limited prefix after sorting', () => {
    const projects = sortProjectsByRecency([
      { id: 'one', startDate: '2024-01-01', endDate: '2024-02-01' },
      { id: 'two', startDate: '2024-03-01', endDate: null },
      { id: 'three', startDate: '2024-02-01', endDate: '2024-04-01' },
    ], 2)

    expect(projects.map(project => project.id)).toEqual(['two', 'three'])
  })

  it('returns an empty list for an explicit zero limit', () => {
    const projects = sortProjectsByRecency([
      { id: 'one', startDate: '2024-01-01', endDate: '2024-02-01' },
      { id: 'two', startDate: '2024-03-01', endDate: null },
    ], 0)

    expect(projects).toEqual([])
  })

  it('keeps empty input stable', () => {
    expect(sortProjectsByRecency([])).toEqual([])
  })
})

import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { ref } from 'vue'

import { useProjectMetadata } from './useProjectMetadata'

async function flushAsyncWork() {
  await Promise.resolve()
  await Promise.resolve()
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useProjectMetadata', () => {
  it('reuses cached project metadata without querying socials again', async () => {
    const cachedMetadata = {
      author: {
        contact: 'hello@todde.tv',
        sameAs: ['https://github.com/toddeTV'],
      },
      socials: [],
    }
    const projectMetadataState = ref(cachedMetadata)
    const asyncData = { data: ref<unknown>(null) }
    const effectCallbacks: Array<() => void> = []
    const all = vi.fn().mockResolvedValue([])
    const queryCollection = vi.fn(() => ({ all }))
    const prepareProjectMetadata = vi.fn()

    vi.stubGlobal('useState', vi.fn(() => projectMetadataState))
    vi.stubGlobal('useAsyncData', vi.fn((_key, handler: () => Promise<unknown>) => {
      Promise.resolve(handler()).then((value) => {
        asyncData.data.value = value
        for (const effect of effectCallbacks) effect()
      })

      return asyncData
    }))
    vi.stubGlobal('watchEffect', vi.fn((effect: () => void) => {
      effectCallbacks.push(effect)
      effect()
    }))
    vi.stubGlobal('queryCollection', queryCollection)
    vi.stubGlobal('prepareProjectMetadata', prepareProjectMetadata)

    const result = useProjectMetadata()

    await flushAsyncWork()

    expect(result).toBe(asyncData)
    expect(queryCollection).not.toHaveBeenCalled()
    expect(all).not.toHaveBeenCalled()
    expect(prepareProjectMetadata).not.toHaveBeenCalled()
    expect(asyncData.data.value).toEqual(cachedMetadata)
    expect(projectMetadataState.value).toEqual(cachedMetadata)
  })

  it('hydrates state from socials when the cache is empty', async () => {
    const socials = [
      {
        featured: true,
        handle: '@toddeTV',
        icon: 'ph:github-logo',
        name: 'GitHub',
        sortOrder: 1,
        url: 'https://github.com/toddeTV',
      },
    ]
    const preparedMetadata = {
      author: {
        contact: 'hello@todde.tv',
        sameAs: ['https://github.com/toddeTV'],
      },
      socials,
    }
    const projectMetadataState = ref<unknown>(null)
    const asyncData = { data: ref<unknown>(null) }
    const effectCallbacks: Array<() => void> = []
    const all = vi.fn().mockResolvedValue(socials)
    const queryCollection = vi.fn(() => ({ all }))
    const prepareProjectMetadata = vi.fn().mockReturnValue(preparedMetadata)

    vi.stubGlobal('useState', vi.fn(() => projectMetadataState))
    vi.stubGlobal('useAsyncData', vi.fn((_key, handler: () => Promise<unknown>) => {
      Promise.resolve(handler()).then((value) => {
        asyncData.data.value = value
        for (const effect of effectCallbacks) effect()
      })

      return asyncData
    }))
    vi.stubGlobal('watchEffect', vi.fn((effect: () => void) => {
      effectCallbacks.push(effect)
      effect()
    }))
    vi.stubGlobal('queryCollection', queryCollection)
    vi.stubGlobal('prepareProjectMetadata', prepareProjectMetadata)

    const result = useProjectMetadata()

    await flushAsyncWork()

    expect(result).toBe(asyncData)
    expect(queryCollection).toHaveBeenCalledWith('socials')
    expect(all).toHaveBeenCalledTimes(1)
    expect(prepareProjectMetadata).toHaveBeenCalledWith(socials)
    expect(asyncData.data.value).toEqual(preparedMetadata)
    expect(projectMetadataState.value).toEqual(preparedMetadata)
  })
})

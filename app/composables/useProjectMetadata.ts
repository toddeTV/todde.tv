import type { SocialsCollectionItem } from '@nuxt/content'

/** Loads hydrated project metadata, including socials-derived fields, for app runtime code. */
export function useProjectMetadata() {
  const projectMetadataState = useState<HydratedProjectMetadata<SocialsCollectionItem> | null>(
    'project-metadata-state',
    () => null,
  )

  const asyncData = useAsyncData('project-metadata', async () => {
    if (projectMetadataState.value) {
      return projectMetadataState.value
    }

    const socials = await queryCollection('socials').all()

    return prepareProjectMetadata(socials)
  })

  watchEffect(() => {
    if (asyncData.data.value) {
      projectMetadataState.value = asyncData.data.value
    }
  })

  return asyncData
}

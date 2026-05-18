import { prepareProjectMetadata } from '#shared/utils/project-metadata'

/** Loads active socials and exposes the prepared project metadata for app setup code. */
export function useProjectMetadata() {
  return useAsyncData('project-metadata', async () => {
    const socials = await queryCollection('socials').all()

    return prepareProjectMetadata(socials)
  })
}

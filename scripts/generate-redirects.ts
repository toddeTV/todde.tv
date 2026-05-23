import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { renderProjectMetadataRedirectsFile } from '../project-metadata.config.ts'

interface GeneratorOptions {
  check: boolean
  outputPath: string
}

const DEFAULT_OUTPUT_PATH = '.output/public/_redirects'

/**
 * Parses CLI arguments for redirect artifact generation.
 * @param {string[]} argv Command-line arguments after the executable and script path.
 * @returns {GeneratorOptions} Parsed generator options.
 * @throws {Error} Thrown when an argument is unknown or `--output` has no value.
 */
function parseArgs(argv: string[]): GeneratorOptions {
  let check = false
  let outputPath = DEFAULT_OUTPUT_PATH

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]

    if (argument === '--check') {
      check = true
      continue
    }

    if (argument === '--output') {
      const nextArgument = argv[index + 1]
      if (!nextArgument) {
        throw new Error('Missing value for `--output`.')
      }
      outputPath = nextArgument
      index += 1
      continue
    }

    throw new Error(`Unknown argument: ${argument}`)
  }

  return {
    check,
    outputPath,
  }
}

/**
 * Verifies that the redirect artifact exists and matches the expected content.
 * @param {string} outputPath Absolute path to the generated redirect artifact.
 * @param {string} expectedContent Redirect artifact content derived from project metadata.
 * @returns {Promise<void>} Resolves when the artifact exists and has no drift.
 * @throws {Error} Thrown when the artifact is missing, unreadable, or differs from expected content.
 */
async function assertRedirectsFile(outputPath: string, expectedContent: string): Promise<void> {
  let actualContent = ''

  try {
    actualContent = await readFile(outputPath, 'utf8')
  }
  catch (error) {
    const relativeOutputPath = relative(process.cwd(), outputPath)

    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `Redirect artifact is missing at ${relativeOutputPath}. `
        + 'Run `vp dlx tsx@4.21.0 scripts/generate-redirects.ts` first.',
        { cause: error },
      )
    }

    throw new Error(
      `Failed to read redirect artifact at ${relativeOutputPath}.`,
      { cause: error },
    )
  }

  if (actualContent !== expectedContent) {
    const relativeOutputPath = relative(process.cwd(), outputPath)
    throw new Error(
      `Redirect artifact drift detected at ${relativeOutputPath}. `
      + 'Regenerate it with `vp dlx tsx@4.21.0 scripts/generate-redirects.ts`.',
    )
  }
}

/**
 * Writes the generated redirect artifact to disk.
 * @param {string} outputPath Absolute path where the redirect artifact should be written.
 * @param {string} expectedContent Redirect artifact content to persist.
 * @returns {Promise<void>} Resolves after the artifact directory exists and the file is written.
 */
async function writeRedirectsFile(outputPath: string, expectedContent: string): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, expectedContent, 'utf8')
}

/**
 * Runs the redirect artifact generator in write or check mode.
 * @returns {Promise<void>} Resolves after the requested generator action completes.
 */
async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  const outputPath = resolve(process.cwd(), options.outputPath)
  const expectedContent = renderProjectMetadataRedirectsFile()

  if (options.check) {
    await assertRedirectsFile(outputPath, expectedContent)
    console.log(`Redirect artifact check passed: ${relative(process.cwd(), outputPath)}`)
    return
  }

  await writeRedirectsFile(outputPath, expectedContent)
  console.log(`Redirect artifact written: ${relative(process.cwd(), outputPath)}`)
}

await main()

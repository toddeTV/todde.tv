import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { renderProjectMetadataRedirectsFile } from '../project-metadata.config.ts'

interface GeneratorOptions {
  check: boolean
  outputPath: string
}

const DEFAULT_OUTPUT_PATH = '.output/public/_redirects'

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

async function assertRedirectsFile(outputPath: string, expectedContent: string): Promise<void> {
  let actualContent = ''

  try {
    actualContent = await readFile(outputPath, 'utf8')
  }
  catch (error) {
    const relativeOutputPath = relative(process.cwd(), outputPath)
    throw new Error(
      `Redirect artifact is missing at ${relativeOutputPath}. `
      + 'Run `node scripts/generate-redirects.ts` first.',
      { cause: error },
    )
  }

  if (actualContent !== expectedContent) {
    const relativeOutputPath = relative(process.cwd(), outputPath)
    throw new Error(
      `Redirect artifact drift detected at ${relativeOutputPath}. `
      + 'Regenerate it with `node scripts/generate-redirects.ts`.',
    )
  }
}

async function writeRedirectsFile(outputPath: string, expectedContent: string): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, expectedContent, 'utf8')
}

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

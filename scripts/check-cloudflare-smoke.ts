const DEFAULT_BASE_URL = 'https://todde.tv'
const DEFAULT_SMOKE_PATHS = [
  '/',
  '/humans.txt',
] as const
const REQUEST_TIMEOUT_MS = 10_000
const RETRY_DELAY_MS = 10_000
const TOTAL_TIMEOUT_MS = 300_000

interface SmokeCheckResult {
  ok: boolean
  message: string
}

/** Resolves the public base URL used for smoke checks. */
function resolveBaseUrl(): URL {
  const rawBaseUrl = process.env.BASE_URL?.trim() || DEFAULT_BASE_URL

  try {
    return new URL(rawBaseUrl)
  }
  catch (error) {
    throw new Error(`Invalid BASE_URL: ${rawBaseUrl}`, { cause: error })
  }
}

/** Waits between smoke-check attempts. */
function wait(delayMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delayMs))
}

/** Checks one public URL and reports status plus body presence. */
async function checkUrl(url: string): Promise<SmokeCheckResult> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    const body = await response.text()

    if (response.status !== 200) {
      return {
        ok: false,
        message: `${url} returned ${response.status}.`,
      }
    }

    if (body.length === 0) {
      return {
        ok: false,
        message: `${url} returned an empty body.`,
      }
    }

    return {
      ok: true,
      message: `${url} returned 200.`,
    }
  }
  catch (error) {
    return {
      ok: false,
      message: `${url} failed: ${(error as Error).message}`,
    }
  }
}

/** Builds the full set of URLs checked after the Pages deploy. */
function buildSmokeUrls(baseUrl: URL): string[] {
  return DEFAULT_SMOKE_PATHS.map(pathname => new URL(pathname, baseUrl).toString())
}

/** Retries the public smoke checks until success or timeout. */
async function main(): Promise<void> {
  const baseUrl = resolveBaseUrl()
  const smokeUrls = buildSmokeUrls(baseUrl)
  const deadline = Date.now() + TOTAL_TIMEOUT_MS
  let attempt = 1

  while (true) {
    const results = await Promise.all(smokeUrls.map(checkUrl))

    if (results.every(result => result.ok)) {
      for (const result of results) {
        console.log(result.message)
      }
      return
    }

    for (const result of results) {
      if (!result.ok) {
        console.log(`Attempt ${attempt}: ${result.message}`)
      }
    }

    if (Date.now() >= deadline) {
      throw new Error(
        `Public smoke check failed for ${smokeUrls.join(' and ')} after 5 minutes.`,
      )
    }

    console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds.`)
    attempt += 1
    await wait(RETRY_DELAY_MS)
  }
}

await main()

/** Returns the document title from prerendered HTML. */
export function extractTitle(html: string): string | null {
  return html.match(/<title>([^<]+)<\/title>/)?.[1] ?? null
}

/** Returns a meta tag content value for a `name` or `property` selector. */
export function extractMetaContent(
  html: string,
  attributeName: string,
  attributeValue: string,
): string | null {
  const escapedAttributeName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedAttributeValue = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta[^>]+${escapedAttributeName}="${escapedAttributeValue}"[^>]+content="([^"]+)"`, 'i')

  return html.match(pattern)?.[1] ?? null
}

/** Returns the canonical link href from prerendered HTML. */
export function extractCanonicalHref(html: string): string | null {
  return html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? null
}

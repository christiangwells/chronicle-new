const BLOCK_BOUNDARY_TAG =
  /<\/(p|div|li|h[1-6]|blockquote|pre|tr)>|<(br|hr)\s*\/?>/gi
const TAG = /<[^>]*>/g
const ENTITY = /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

/**
 * Convert the editor's HTML output into plain text, e.g. for keyword search.
 *
 * This is not a general purpose sanitiser - the output must not be rendered as HTML.
 */
export function htmlToPlainText(html: string): string {
  return (
    html
      // Whitespace in the HTML source (including newlines) isn't significant
      .replace(/\s+/g, ' ')
      .replace(BLOCK_BOUNDARY_TAG, '\n')
      .replace(TAG, '')
      .replace(ENTITY, decodeEntity)
      .split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('\n')
  )
}

function decodeEntity(match: string, entity: string): string {
  if (entity.startsWith('#')) {
    const codePoint =
      entity[1].toLowerCase() === 'x'
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10)

    return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match
  }

  return NAMED_ENTITIES[entity.toLowerCase()] ?? match
}

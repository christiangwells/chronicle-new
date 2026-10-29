import { describe, expect, it } from 'vitest'

import { htmlToPlainText } from './html'

describe('htmlToPlainText', () => {
  it('strips tags and puts blocks on separate lines', () => {
    expect(
      htmlToPlainText(
        '<p>First <strong>bold</strong> line</p><p>Second<br>line</p><ul><li><p>item</p></li></ul>',
      ),
    ).toBe('First bold line\nSecond\nline\nitem')
  })

  it('does not include tag or attribute names', () => {
    expect(
      htmlToPlainText(
        '<p><a href="https://example.com" class="x">link</a></p>',
      ),
    ).toBe('link')
  })

  it('decodes entities', () => {
    expect(
      htmlToPlainText(
        '<p>Fish &amp; chips&nbsp;&lt;3 &quot;yum&quot; &#39;&#x2764;&#65039;</p>',
      ),
    ).toBe('Fish & chips <3 "yum" \'❤️')
  })

  it('leaves unknown entities alone', () => {
    expect(htmlToPlainText('<p>&bogus; &#xFFFFFFF;</p>')).toBe(
      '&bogus; &#xFFFFFFF;',
    )
  })

  it('collapses whitespace and drops empty lines', () => {
    expect(htmlToPlainText('<p>  a \n  b  </p><p></p><p> c</p>')).toBe('a b\nc')
  })

  it('handles empty input', () => {
    expect(htmlToPlainText('')).toBe('')
  })
})

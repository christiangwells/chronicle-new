import type React from 'react'

interface HighlightProps {
  text: string
  terms: string[]
}

export const Highlight: React.FC<HighlightProps> = ({ text, terms }) => {
  if (terms.length === 0) return text

  const pattern = new RegExp(
    `(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi',
  )

  // With a capturing group, split puts the matches at odd indices
  return text.split(pattern).map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="bg-primary/20 text-foreground rounded-sm">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

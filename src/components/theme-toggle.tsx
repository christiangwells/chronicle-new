import { MoonIcon, SunIcon } from 'lucide-react'
import type React from 'react'

import { Button } from '~/components/ui/button'
import { useTheme } from '~/integrations/theme/root-provider'
import { cn } from '~/lib/utils'

export const ModeToggle: React.FC<{ className?: string }> = (props) => {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      className={cn('size-8', props.className)}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}

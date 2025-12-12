import { Moon, Sun } from 'lucide-react'
import type React from 'react'

import { useTheme } from '~/integrations/theme/root-provider'

export const ModeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Moon /> : <Sun />}
    </button>
  )
}

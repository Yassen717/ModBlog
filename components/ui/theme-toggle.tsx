'use client'

import * as React from 'react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const themeIcons = {
  light: '☀️',
  dark: '🌙',
  system: '💻'
}

const themeLabels = {
  light: 'Light',
  dark: 'Dark', 
  system: 'System'
}

export function ThemeToggle({ 
  size = 'md', 
  showLabel = false, 
  className 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  
  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      cycleTheme()
    }
  }

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'

  return (
    <Button
      variant="ghost"
      size={buttonSize}
      onClick={cycleTheme}
      onKeyDown={handleKeyDown}
      className={cn(
        'transition-all duration-200 ease-in-out',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
        showLabel && 'gap-2',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      title={`Current theme: ${themeLabels[theme]}. Click to cycle themes.`}
    >
      <span 
        className="text-lg transition-transform duration-200 ease-in-out hover:scale-110"
        role="img"
        aria-hidden="true"
      >
        {themeIcons[theme]}
      </span>
      {showLabel && (
        <span className="text-sm font-medium">
          {themeLabels[theme]}
        </span>
      )}
    </Button>
  )
}
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind classes with admin theme classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Admin color palette definitions
 */
export const adminColors = {
  light: {
    sidebar: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
    },
    topbar: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
    },
    card: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      shadow: 'shadow-sm',
    },
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      ghost: 'hover:bg-gray-100 text-gray-700',
    },
    input: {
      bg: 'bg-white',
      border: 'border-gray-300',
      text: 'text-gray-900',
      placeholder: 'placeholder-gray-500',
      focus: 'focus:border-blue-500 focus:ring-blue-500',
    },
    navigation: {
      active: 'bg-blue-100 text-blue-700',
      inactive: 'text-gray-700 hover:bg-gray-100',
    },
  },
  dark: {
    sidebar: {
      bg: 'dark:bg-gray-800',
      border: 'dark:border-gray-700',
      text: 'dark:text-white',
      textSecondary: 'dark:text-gray-300',
    },
    topbar: {
      bg: 'dark:bg-gray-800',
      border: 'dark:border-gray-700',
      text: 'dark:text-white',
    },
    card: {
      bg: 'dark:bg-gray-800',
      border: 'dark:border-gray-700',
      text: 'dark:text-white',
      textSecondary: 'dark:text-gray-300',
      shadow: 'dark:shadow-lg',
    },
    button: {
      primary: 'dark:bg-blue-600 dark:hover:bg-blue-700',
      secondary: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
      ghost: 'dark:hover:bg-gray-700 dark:text-gray-300',
    },
    input: {
      bg: 'dark:bg-gray-900',
      border: 'dark:border-gray-600',
      text: 'dark:text-white',
      placeholder: 'dark:placeholder-gray-400',
      focus: 'dark:focus:border-blue-400 dark:focus:ring-blue-400',
    },
    navigation: {
      active: 'dark:bg-blue-900 dark:text-blue-300',
      inactive: 'dark:text-gray-300 dark:hover:bg-gray-700',
    },
  },
} as const

/**
 * Generate theme-aware classes for admin components
 */
export function getAdminThemeClasses(component: keyof typeof adminColors.light) {
  const lightClasses = adminColors.light[component]
  const darkClasses = adminColors.dark[component]
  
  const combined: Record<string, string> = {}
  
  // Combine light and dark classes for each property
  Object.keys(lightClasses).forEach((key) => {
    const lightClass = lightClasses[key as keyof typeof lightClasses]
    const darkClass = darkClasses[key as keyof typeof darkClasses]
    combined[key] = cn(lightClass, darkClass)
  })
  
  return combined
}

/**
 * Admin component class generators
 */
export const adminTheme = {
  sidebar: () => cn(
    'bg-white dark:bg-gray-800',
    'border-gray-200 dark:border-gray-700',
    'text-gray-900 dark:text-white',
    'transition-colors duration-200'
  ),
  
  topbar: () => cn(
    'bg-white dark:bg-gray-800',
    'border-gray-200 dark:border-gray-700',
    'text-gray-900 dark:text-white',
    'transition-colors duration-200'
  ),
  
  card: () => cn(
    'bg-white dark:bg-gray-800',
    'border-gray-200 dark:border-gray-700',
    'text-gray-900 dark:text-white',
    'shadow-sm dark:shadow-lg',
    'transition-colors duration-200'
  ),
  
  button: {
    primary: () => cn(
      'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
      'text-white',
      'transition-colors duration-200'
    ),
    secondary: () => cn(
      'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200'
    ),
    ghost: () => cn(
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      'text-gray-700 dark:text-gray-300',
      'transition-colors duration-200'
    ),
  },
  
  input: () => cn(
    'bg-white dark:bg-gray-900',
    'border-gray-300 dark:border-gray-600',
    'text-gray-900 dark:text-white',
    'placeholder-gray-500 dark:placeholder-gray-400',
    'focus:border-blue-500 focus:ring-blue-500',
    'dark:focus:border-blue-400 dark:focus:ring-blue-400',
    'transition-colors duration-200'
  ),
  
  navigation: {
    active: () => cn(
      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'transition-colors duration-200'
    ),
    inactive: () => cn(
      'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
      'transition-colors duration-200'
    ),
  },
  
  text: {
    primary: () => cn('text-gray-900 dark:text-white'),
    secondary: () => cn('text-gray-600 dark:text-gray-300'),
    muted: () => cn('text-gray-500 dark:text-gray-400'),
  },
}

/**
 * Accessibility helpers
 */
export const a11y = {
  focusRing: () => cn(
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'
  ),
  
  highContrast: () => cn(
    'contrast-more:border-black dark:contrast-more:border-white',
    'contrast-more:text-black dark:contrast-more:text-white'
  ),
  
  reducedMotion: () => cn(
    'motion-reduce:transition-none',
    'motion-reduce:animate-none'
  ),
}

/**
 * Animation utilities
 */
export const animations = {
  fadeIn: () => cn(
    'animate-in fade-in-0 duration-200'
  ),
  
  slideIn: () => cn(
    'animate-in slide-in-from-left-2 duration-300'
  ),
  
  scaleIn: () => cn(
    'animate-in zoom-in-95 duration-200'
  ),
  
  themeTransition: () => cn(
    'transition-all duration-200 ease-in-out'
  ),
}

/**
 * Responsive utilities for admin layout
 */
export const responsive = {
  sidebar: {
    mobile: () => cn(
      'fixed inset-y-0 left-0 z-50 w-64',
      'transform transition-transform duration-300 ease-in-out',
      'lg:translate-x-0 lg:static lg:inset-0'
    ),
    desktop: () => cn('hidden lg:flex lg:flex-col lg:w-64'),
  },
  
  main: {
    withSidebar: () => cn('lg:ml-64'),
    fullWidth: () => cn('w-full'),
  },
}

/**
 * Status and state utilities
 */
export const status = {
  success: () => cn(
    'text-green-600 dark:text-green-400',
    'bg-green-50 dark:bg-green-900/20',
    'border-green-200 dark:border-green-800'
  ),
  
  warning: () => cn(
    'text-yellow-600 dark:text-yellow-400',
    'bg-yellow-50 dark:bg-yellow-900/20',
    'border-yellow-200 dark:border-yellow-800'
  ),
  
  error: () => cn(
    'text-red-600 dark:text-red-400',
    'bg-red-50 dark:bg-red-900/20',
    'border-red-200 dark:border-red-800'
  ),
  
  info: () => cn(
    'text-blue-600 dark:text-blue-400',
    'bg-blue-50 dark:bg-blue-900/20',
    'border-blue-200 dark:border-blue-800'
  ),
}
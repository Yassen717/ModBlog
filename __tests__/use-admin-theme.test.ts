import { renderHook, act } from '@testing-library/react'
import { useAdminTheme, useThemeWatcher, useThemePersistence } from '@/hooks/use-admin-theme'

// Mock the theme context
const mockSetTheme = jest.fn()
const mockThemeContext = {
  theme: 'light' as const,
  actualTheme: 'light' as const,
  setTheme: mockSetTheme,
  primaryColor: '#3B82F6',
  setPrimaryColor: jest.fn(),
  fontFamily: 'Inter',
  setFontFamily: jest.fn(),
}

jest.mock('@/contexts/theme-context', () => ({
  useTheme: () => mockThemeContext,
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useAdminTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns theme context values', () => {
    const { result } = renderHook(() => useAdminTheme())
    
    expect(result.current.theme).toBe('light')
    expect(result.current.actualTheme).toBe('light')
    expect(result.current.isDark).toBe(false)
    expect(result.current.isLight).toBe(true)
    expect(result.current.isSystem).toBe(false)
  })

  it('provides theme utility functions', () => {
    const { result } = renderHook(() => useAdminTheme())
    
    expect(result.current.getThemeIcon()).toBe('☀️')
    expect(result.current.getThemeLabel()).toBe('Light mode')
  })

  it('provides theme classes', () => {
    const { result } = renderHook(() => useAdminTheme())
    
    const classes = result.current.getThemeClasses()
    expect(classes.background).toBe('bg-gray-50')
    expect(classes.card).toBe('bg-white border-gray-200')
    expect(classes.text.primary).toBe('text-gray-900')
  })

  it('handles theme transitions', async () => {
    const { result } = renderHook(() => useAdminTheme())
    
    act(() => {
      result.current.setThemeWithTransition('dark')
    })
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    expect(result.current.isTransitioning).toBe(true)
    
    // Wait for transition to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 250))
    })
    
    expect(result.current.isTransitioning).toBe(false)
  })

  it('detects system theme correctly', () => {
    // Mock system theme as dark
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    mockThemeContext.theme = 'system'
    mockThemeContext.actualTheme = 'dark'

    const { result } = renderHook(() => useAdminTheme())
    
    expect(result.current.isSystemThemeActive()).toBe(true)
  })
})

describe('useThemeWatcher', () => {
  it('calls callback when theme changes', () => {
    const callback = jest.fn()
    renderHook(() => useThemeWatcher(callback))
    
    expect(callback).toHaveBeenCalledWith('light')
  })

  it('returns current actual theme', () => {
    const { result } = renderHook(() => useThemeWatcher())
    
    expect(result.current).toBe('light')
  })
})

describe('useThemePersistence', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  it('detects localStorage availability', () => {
    const { result } = renderHook(() => useThemePersistence())
    
    expect(result.current.isStorageAvailable).toBe(true)
  })

  it('handles storage errors gracefully', () => {
    // Mock localStorage to throw error
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error')
    })

    const { result } = renderHook(() => useThemePersistence())
    
    expect(result.current.persistenceError).toBeNull() // Should handle error gracefully
  })

  it('provides recovery functions', () => {
    const { result } = renderHook(() => useThemePersistence())
    
    expect(typeof result.current.recoverThemeSettings).toBe('function')
    expect(typeof result.current.resetToSystemTheme).toBe('function')
  })

  it('resets to system theme', () => {
    const { result } = renderHook(() => useThemePersistence())
    
    act(() => {
      result.current.resetToSystemTheme()
    })
    
    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })
})
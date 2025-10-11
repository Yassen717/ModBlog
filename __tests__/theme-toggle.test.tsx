import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ThemeProvider } from '@/contexts/theme-context'
import '@testing-library/jest-dom'

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
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with correct initial theme icon', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('☀️') // Light theme icon
  })

  it('cycles through themes when clicked', async () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    
    // Click to cycle from light to dark
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    
    // Update mock to reflect dark theme
    mockThemeContext.theme = 'dark'
    
    // Click to cycle from dark to system
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith('system')
    
    // Update mock to reflect system theme
    mockThemeContext.theme = 'system'
    
    // Click to cycle from system to light
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('handles keyboard navigation', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ' })
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('displays label when showLabel is true', () => {
    render(<ThemeToggle showLabel />)
    
    expect(screen.getByText('Light')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
    expect(button).toHaveAttribute('title')
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<ThemeToggle size="sm" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-9')
    
    rerender(<ThemeToggle size="lg" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-11')
  })

  it('applies custom className', () => {
    render(<ThemeToggle className="custom-class" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})
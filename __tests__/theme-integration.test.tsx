import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import '@testing-library/jest-dom'

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

// Mock the storage functions
jest.mock('@/lib/storage', () => ({
  getSettings: jest.fn(() => ({
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      fontFamily: 'Inter',
    }
  })),
  saveSettings: jest.fn(),
  getDefaultSettings: jest.fn(() => ({
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      fontFamily: 'Inter',
    }
  })),
}))

const TestComponent = () => (
  <ThemeProvider>
    <div className="p-4">
      <ThemeToggle />
      <Button>Test Button</Button>
      <Card className="p-4 mt-4">
        <h2>Test Card</h2>
        <Input placeholder="Test input" />
      </Card>
    </div>
  </ThemeProvider>
)

describe('Theme Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders components with light theme by default', async () => {
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light')
    })
    
    const button = screen.getByRole('button', { name: /test button/i })
    expect(button).toHaveClass('bg-blue-600')
  })

  it('switches themes when toggle is clicked', async () => {
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light')
    })
    
    const themeToggle = screen.getByRole('button', { name: /switch to dark theme/i })
    fireEvent.click(themeToggle)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })

  it('persists theme changes to localStorage', async () => {
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light')
    })
    
    const themeToggle = screen.getByRole('button', { name: /switch to dark theme/i })
    fireEvent.click(themeToggle)
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })

  it('applies theme classes to components', async () => {
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light')
    })
    
    const card = screen.getByText('Test Card').closest('div')
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('border-gray-200')
    
    // Switch to dark theme
    const themeToggle = screen.getByRole('button', { name: /switch to dark theme/i })
    fireEvent.click(themeToggle)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
    
    // Check dark theme classes are applied
    expect(card).toHaveClass('dark:bg-gray-800')
    expect(card).toHaveClass('dark:border-gray-700')
  })

  it('handles system theme preference', async () => {
    // Mock system preference for dark theme
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

    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light')
    })
    
    // Click twice to get to system theme
    const themeToggle = screen.getByRole('button')
    fireEvent.click(themeToggle) // light -> dark
    fireEvent.click(themeToggle) // dark -> system
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })

  it('maintains theme consistency across page reloads', async () => {
    // Mock localStorage to return dark theme
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      appearance: {
        theme: 'dark',
        primaryColor: '#3B82F6',
        fontFamily: 'Inter',
      }
    }))

    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })

  it('handles theme transitions smoothly', async () => {
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light')
    })
    
    const themeToggle = screen.getByRole('button')
    
    // Check for transition classes
    const card = screen.getByText('Test Card').closest('div')
    expect(card).toHaveClass('transition-all')
    
    fireEvent.click(themeToggle)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })

  it('provides proper accessibility attributes', async () => {
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light')
    })
    
    const themeToggle = screen.getByRole('button')
    expect(themeToggle).toHaveAttribute('aria-label')
    expect(themeToggle).toHaveAttribute('title')
    
    const input = screen.getByPlaceholderText('Test input')
    expect(input).toHaveClass('focus-visible:ring-2')
    expect(input).toHaveClass('focus-visible:ring-blue-500')
  })
})
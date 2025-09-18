'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">MB</span>
          </div>
          <span className="font-bold text-xl">Modern Blog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Blog
          </Link>
          <Link 
            href="/categories" 
            className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Categories
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">Search</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className="block text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/categories" 
              className="block text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className="block text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <Link href="/search" onClick={() => setIsMenuOpen(false)}>Search</Link>
              </Button>
              <Button size="sm" className="w-full" asChild>
                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
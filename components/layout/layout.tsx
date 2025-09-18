'use client'

import { Header } from './header'
import { Footer } from './footer'
import { useSampleData } from '@/hooks/use-sample-data'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  // Initialize sample data on app startup
  useSampleData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
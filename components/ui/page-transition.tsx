'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setIsVisible(false)
    setIsLoading(true)
    
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsVisible(true)
    }, 200)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className="relative">
      {/* Loading overlay with slide animation */}
      <div className={`fixed inset-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-500 ease-in-out ${
        isLoading ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading...</p>
          </div>
        </div>
      </div>
      
      {/* Content with fade and slide animation */}
      <div
        className={`transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
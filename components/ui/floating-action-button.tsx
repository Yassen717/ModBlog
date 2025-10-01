'use client'

import { useState } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function FloatingActionButton({ 
  children, 
  className, 
  onClick 
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white',
        'transform hover:scale-110 active:scale-95 hover:rotate-12',
        isHovered && 'animate-pulse-glow',
        className
      )}
    >
      <div className={cn(
        'transition-transform duration-300',
        isHovered && 'scale-110'
      )}>
        {children}
      </div>
    </Button>
  )
}

export function ShareButton() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  return (
    <FloatingActionButton onClick={handleShare} className="bottom-24">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
    </FloatingActionButton>
  )
}
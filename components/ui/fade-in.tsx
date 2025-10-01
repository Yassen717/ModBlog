'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 600, 
  direction = 'up',
  className 
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)'
    
    switch (direction) {
      case 'up':
        return 'translate3d(0, 30px, 0)'
      case 'down':
        return 'translate3d(0, -30px, 0)'
      case 'left':
        return 'translate3d(30px, 0, 0)'
      case 'right':
        return 'translate3d(-30px, 0, 0)'
      default:
        return 'translate3d(0, 0, 0)'
    }
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  )
}

export function StaggeredFadeIn({ 
  children, 
  staggerDelay = 100,
  ...props 
}: FadeInProps & { staggerDelay?: number }) {
  return (
    <>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <FadeIn key={index} delay={index * staggerDelay} {...props}>
              {child}
            </FadeIn>
          ))
        : <FadeIn {...props}>{children}</FadeIn>
      }
    </>
  )
}
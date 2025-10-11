'use client'

import { useEffect } from 'react'
import { initializeSampleData } from '@/lib/sample-data'

export function useSampleData() {
  useEffect(() => {
    // Force initialization on mount to ensure migration happens
    initializeSampleData()
    
    // Log to console for debugging
    console.log('Sample data initialized/migrated')
  }, [])
}
'use client'

import { useEffect } from 'react'
import { initializeSampleData } from '@/lib/sample-data'

export function useSampleData() {
  useEffect(() => {
    // Idempotent and non-destructive: seeds missing keys and migrates stale image URLs
    initializeSampleData()
  }, [])
}
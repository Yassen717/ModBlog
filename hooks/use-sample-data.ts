'use client'

import { useEffect } from 'react'
import { initializeSampleData } from '@/lib/sample-data'

export function useSampleData() {
  useEffect(() => {
    initializeSampleData()
  }, [])
}
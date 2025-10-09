'use client'

import { Suspense } from 'react'
import BlogPageContent from './blog-content'

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  )
}

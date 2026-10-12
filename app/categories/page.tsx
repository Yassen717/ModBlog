import { Suspense } from 'react'
import CategoriesContent from './categories-content'

export const metadata = {
  title: 'Categories - Modern Blog',
  description: 'Explore our blog content organized by categories including Web Development, JavaScript, React, Next.js, and CSS.',
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <CategoriesContent />
    </Suspense>
  )
}

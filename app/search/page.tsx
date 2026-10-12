import { Suspense } from 'react'
import SearchContent from './search-content'

export const metadata = {
  title: 'Search - Modern Blog',
  description: 'Search our collection of articles by title, content, or tags.',
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

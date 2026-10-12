'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Post } from '@/types/blog'
import { searchPosts } from '@/lib/storage'
import { PostGrid } from '@/components/blog/post-grid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(!!initialQuery)

  // Debounce the search and URL sync so typing doesn't thrash either one
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true)
        try {
          setResults(searchPosts(query))
          setHasSearched(true)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setHasSearched(false)
      }

      const newParams = new URLSearchParams(searchParams.toString())
      if (query) {
        newParams.set('q', query)
      } else {
        newParams.delete('q')
      }
      const paramString = newParams.toString()
      if (paramString !== searchParams.toString()) {
        router.replace(`/search?${paramString}`, { scroll: false })
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query, router, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // The search is already performed by the debounced effect above
      setHasSearched(true)
    }
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Search Articles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find articles by title, content, or tags
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-4 pl-6 pr-24 text-lg rounded-full border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 py-2"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {isLoading ? 'Searching...' : `Search Results (${results.length})`}
              </h2>
              {query && !isLoading && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Showing results for: <span className="font-semibold">&quot;{query}&quot;</span>
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : results.length > 0 ? (
              <PostGrid posts={results} />
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We couldn&apos;t find any articles matching &quot;{query}&quot;. Try different keywords.
                </p>
                <Button 
                  onClick={() => {
                    setQuery('')
                    setResults([])
                    setHasSearched(false)
                  }}
                  variant="secondary"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty state when no search has been performed */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Search Our Articles
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enter a keyword above to search through our collection of articles. 
              We&apos;ll look through titles, content, and tags to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

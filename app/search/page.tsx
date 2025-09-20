'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Post } from '@/types/blog'
import { searchPosts } from '@/lib/storage'
import { SearchBar } from '@/components/blog/search-bar'
import { PostGrid } from '@/components/blog/post-grid'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const searchQuery = searchParams.get('q') || ''
    setQuery(searchQuery)
    performSearch(searchQuery)
  }, [searchParams])

  const performSearch = (searchQuery: string) => {
    setLoading(true)
    
    try {
      if (searchQuery.trim()) {
        const results = searchPosts(searchQuery)
        setPosts(results)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error('Error searching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    performSearch(newQuery)
    
    // Update URL without navigation
    const url = new URL(window.location.href)
    if (newQuery.trim()) {
      url.searchParams.set('q', newQuery)
    } else {
      url.searchParams.delete('q')
    }
    window.history.replaceState({}, '', url.toString())
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="py-12">
      {/* Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Search Articles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Find articles by title, content, or tags
          </p>
          
          <SearchBar 
            initialQuery={query}
            onSearch={handleSearch}
            placeholder="Search for articles, topics, or keywords..."
            className="max-w-lg mx-auto"
          />
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4">
        {query ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Search Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {posts.length === 0 
                  ? `No articles found for "${query}"`
                  : `Found ${posts.length} ${posts.length === 1 ? 'article' : 'articles'} for "${query}"`
                }
              </p>
            </div>
            
            {posts.length > 0 ? (
              <PostGrid posts={posts} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search terms or browse our categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleSearch('')}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Clear search
                  </button>
                  <a
                    href="/categories"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                  >
                    Browse Categories
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Start your search
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Enter keywords to find relevant articles and topics.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
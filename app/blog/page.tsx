'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Post } from '@/types/blog'
import { getPublishedPosts } from '@/lib/storage'
import { PostGrid } from '@/components/blog/post-grid'
import { Button } from '@/components/ui/button'
import { sampleCategories } from '@/lib/sample-data'

export default function BlogPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const tagFilter = searchParams.get('tag')
  
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const postsPerPage = 6

  useEffect(() => {
    const loadPosts = () => {
      try {
        const allPosts = getPublishedPosts()
        setPosts(allPosts)
        
        // Apply filters
        let filtered = allPosts
        
        if (categoryFilter) {
          filtered = filtered.filter(post => post.category.slug === categoryFilter)
        }
        
        if (tagFilter) {
          const tag = tagFilter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          filtered = filtered.filter(post => 
            post.tags.some(postTag => 
              postTag.toLowerCase().replace(/\s+/g, '-') === tagFilter ||
              postTag.toLowerCase() === tag.toLowerCase()
            )
          )
        }
        
        setFilteredPosts(filtered)
        setDisplayedPosts(filtered.slice(0, postsPerPage))
        setCurrentPage(1)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [categoryFilter, tagFilter])

  const loadMorePosts = () => {
    setLoadingMore(true)
    
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = 0
      const endIndex = nextPage * postsPerPage
      
      setDisplayedPosts(filteredPosts.slice(startIndex, endIndex))
      setCurrentPage(nextPage)
      setLoadingMore(false)
    }, 500) // Simulate loading delay
  }

  const hasMorePosts = displayedPosts.length < filteredPosts.length
  
  // Get current category for display
  const currentCategory = categoryFilter 
    ? sampleCategories.find(cat => cat.slug === categoryFilter)
    : null

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
        <div className="text-center">
          {currentCategory ? (
            <>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: currentCategory.color }}
                >
                  {currentCategory.name.charAt(0)}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                  {currentCategory.name}
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {currentCategory.description}
              </p>
            </>
          ) : tagFilter ? (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                #{tagFilter.replace(/-/g, '')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Articles tagged with {tagFilter.replace(/-/g, ' ')}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                All Blog Posts
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore our collection of articles covering web development, programming, and technology insights.
              </p>
            </>
          )}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} 
            {categoryFilter || tagFilter ? ' found' : ' published'}
          </div>
          {(categoryFilter || tagFilter) && (
            <div className="mt-4">
              <Button variant="secondary" asChild>
                <Link href="/blog">← View All Posts</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4">
        <PostGrid posts={displayedPosts} />
        
        {/* Load More Button */}
        {hasMorePosts && (
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="min-w-[200px]"
            >
              {loadingMore ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                `Load More Posts (${filteredPosts.length - displayedPosts.length} remaining)`
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
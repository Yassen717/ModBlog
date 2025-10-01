import { Post, Category } from '@/types/blog'
import { PostGrid } from '@/components/blog/post-grid'

interface SearchResultsProps {
  posts: Post[]
  loading: boolean
  hasSearched: boolean
  query: string
  selectedCategory: string
  categories: Category[]
}

export function SearchResults({ 
  posts, 
  loading, 
  hasSearched, 
  query, 
  selectedCategory, 
  categories 
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
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
            Start Your Search
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Enter keywords or select a category to find relevant articles.
          </p>
        </div>
      </div>
    )
  }

  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.name 
    : null

  const getResultsDescription = () => {
    if (query && selectedCategory) {
      return `"${query}" in ${selectedCategoryName}`
    } else if (query) {
      return `"${query}"`
    } else if (selectedCategory) {
      return `${selectedCategoryName} category`
    }
    return 'all posts'
  }

  return (
    <div>
      {/* Results Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Search Results
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {posts.length} {posts.length === 1 ? 'result' : 'results'} found
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          Showing results for {getResultsDescription()}
        </p>
        
        {/* Search highlights */}
        {query && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Search: {query}
            </span>
            {selectedCategoryName && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 ml-2">
                Category: {selectedCategoryName}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Grid */}
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              We couldn't find any articles matching your search criteria.
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Using different keywords</li>
                <li>Checking your spelling</li>
                <li>Using more general terms</li>
                <li>Browsing different categories</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
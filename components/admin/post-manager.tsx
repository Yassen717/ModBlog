'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

interface PostManagerProps {
  posts: Post[]
  onDeletePost: (postId: string) => void
  onRefresh: () => void
}

export function PostManager({ posts, onDeletePost, onRefresh }: PostManagerProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true
    return post.status === filter
  })

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    
    if (status === 'published') {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
    } else {
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Manage Posts</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Filter Buttons */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                All ({posts.length})
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-200 dark:border-gray-700 ${
                  filter === 'published'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Published ({posts.filter(p => p.status === 'published').length})
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-200 dark:border-gray-700 ${
                  filter === 'draft'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Drafts ({posts.filter(p => p.status === 'draft').length})
              </button>
            </div>
            
            <Button asChild>
              <Link href="/admin/posts/new">New Post</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPosts.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No posts found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all' 
                ? "You haven't created any posts yet." 
                : `No ${filter} posts found.`}
            </p>
            <Button asChild>
              <Link href="/admin/posts/new">Create Your First Post</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                      {post.title}
                    </h3>
                    <span className={getStatusBadge(post.status)}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Category: {post.category.name}</span>
                    <span>•</span>
                    <span>Updated: {formatDate(post.updatedAt)}</span>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
                  {post.status === 'published' && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        View
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePost(post.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Mock posts data
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with Next.js 14 and the App Router',
    status: 'published',
    author: 'John Doe',
    category: 'Next.js',
    publishedAt: '2024-01-15',
    views: 1234,
    comments: 5,
  },
  {
    id: '2',
    title: 'Mastering TypeScript: Advanced Types and Patterns',
    status: 'draft',
    author: 'John Doe',
    category: 'JavaScript',
    publishedAt: '2024-01-14',
    views: 856,
    comments: 3,
  },
  {
    id: '3',
    title: 'Building Responsive Layouts with CSS Grid and Flexbox',
    status: 'published',
    author: 'John Doe',
    category: 'CSS',
    publishedAt: '2024-01-13',
    views: 2341,
    comments: 8,
  },
  {
    id: '4',
    title: 'React Server Components: The Future of React',
    status: 'published',
    author: 'John Doe',
    category: 'React',
    publishedAt: '2024-01-12',
    views: 1876,
    comments: 12,
  },
  {
    id: '5',
    title: 'Modern JavaScript: ES2024 Features You Should Know',
    status: 'scheduled',
    author: 'John Doe',
    category: 'JavaScript',
    publishedAt: '2024-01-20',
    views: 0,
    comments: 0,
  },
]

const statusColors = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
}

export default function PostsAdmin() {
  const [posts, setPosts] = useState(mockPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== id))
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: newStatus } : post
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">✍️ New Post</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
            <Button variant="secondary">
              📊 Bulk Actions
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {posts.filter(p => p.status === 'published').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {posts.filter(p => p.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {posts.reduce((sum, post) => sum + post.comments, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Comments</div>
        </Card>
      </div>

      {/* Posts Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        by {post.author}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[post.status as keyof typeof statusColors]}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {post.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      👁️ {post.views.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      💬 {post.comments}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {post.publishedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>📝</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>👁️</Link>
                      </Button>
                      <div className="relative group">
                        <Button variant="ghost" size="sm">
                          ⋮
                        </Button>
                        <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <div className="py-1">
                            <button
                              onClick={() => handleStatusChange(post.id, post.status === 'published' ? 'draft' : 'published')}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            >
                              {post.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              onClick={() => {/* Duplicate logic */}}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="block px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" disabled>
            Previous
          </Button>
          <Button variant="secondary" size="sm">
            1
          </Button>
          <Button variant="secondary" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
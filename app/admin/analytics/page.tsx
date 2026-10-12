'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Post, Comment, Category } from '@/types/blog'
import { getAllPosts, getComments, getCommentsByPost, getCategories, getUsers } from '@/lib/storage'
import { formatDate } from '@/lib/utils'

const commentStatusColors = {
  approved: 'bg-green-500',
  pending: 'bg-yellow-500',
  spam: 'bg-red-500',
}

export default function AnalyticsAdmin() {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    setPosts(getAllPosts())
    setComments(getComments())
    setCategories(getCategories())
    setTotalUsers(getUsers().length)
  }, [])

  const publishedCount = posts.filter(p => p.status === 'published').length
  const avgReadingTime = posts.length > 0
    ? Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length)
    : 0

  const overview = [
    { name: 'Total Posts', value: posts.length },
    { name: 'Published', value: publishedCount },
    { name: 'Drafts', value: posts.length - publishedCount },
    { name: 'Total Comments', value: comments.length },
    { name: 'Avg Reading Time', value: `${avgReadingTime} min` },
    { name: 'Total Users', value: totalUsers },
  ]

  const categoryCounts = categories.map(category => ({
    ...category,
    count: posts.filter(post => post.category.id === category.id).length,
  }))
  const maxCategoryCount = Math.max(...categoryCounts.map(c => c.count), 1)

  // getAllPosts() is already sorted by updatedAt desc
  const recentPosts = posts.slice(0, 5)

  const commentsByStatus = (['approved', 'pending', 'spam'] as const).map(status => ({
    status,
    count: comments.filter(c => c.status === status).length,
  }))
  const maxCommentStatusCount = Math.max(...commentsByStatus.map(c => c.count), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your blog&apos;s performance and engagement</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {overview.map((stat) => (
          <Card key={stat.name} className="p-4 text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {stat.name}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts per Category */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🏷️ Posts per Category
          </h2>
          <div className="space-y-4">
            {categoryCounts.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {category.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(category.count / maxCategoryCount) * 100}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
            {categoryCounts.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No categories yet.</p>
            )}
          </div>
        </Card>

        {/* Comments by Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            💬 Comments by Status
          </h2>
          <div className="space-y-4">
            {commentsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize w-24">
                  {item.status}
                </span>
                <div className="flex-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${commentStatusColors[item.status]}`}
                    style={{ width: `${(item.count / maxCommentStatusCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📝 Recent Posts
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Post Title</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Comments</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">
                    <span className="text-sm text-gray-900 dark:text-white">{post.title}</span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="text-right py-3 text-sm text-gray-900 dark:text-white">
                    {getCommentsByPost(post.id).length}
                  </td>
                  <td className="text-right py-3 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.updatedAt)}
                  </td>
                </tr>
              ))}
              {recentPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No posts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

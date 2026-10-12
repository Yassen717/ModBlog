'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Post, Comment, Category } from '@/types/blog'
import { getAllPosts, getComments, getCategories, getUsers, saveComment } from '@/lib/storage'
import { formatDate } from '@/lib/utils'

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setPosts(getAllPosts())
    setComments(
      getComments().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    )
    setCategories(getCategories())
    setUserCount(getUsers().length)
  }, [])

  const publishedCount = posts.filter(p => p.status === 'published').length
  const pendingCount = comments.filter(c => c.status === 'pending').length

  const stats = [
    { name: 'Total Posts', value: posts.length, sub: `${publishedCount} published` },
    { name: 'Published', value: publishedCount, sub: `${posts.length - publishedCount} drafts` },
    { name: 'Comments', value: comments.length, sub: `${pendingCount} pending` },
    { name: 'Users', value: userCount, sub: 'registered' },
  ]

  const recentPosts = posts.slice(0, 4)
  const recentComments = comments.slice(0, 3)

  const categoryCounts = categories.map(category => ({
    ...category,
    count: posts.filter(post => post.category.id === category.id).length,
  }))
  const maxCategoryCount = Math.max(...categoryCounts.map(c => c.count), 1)

  const handleCommentStatus = (comment: Comment, status: Comment['status']) => {
    const updated = { ...comment, status, updatedAt: new Date() }
    saveComment(updated)
    setComments(comments.map(c => (c.id === comment.id ? updated : c)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here&apos;s what&apos;s happening with your blog.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">{currentTime}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/admin/posts/new">✍️ New Post</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/admin/analytics">📊 View Analytics</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/admin/comments">💬 Moderate Comments</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.sub}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Posts</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.publishedAt)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.readingTime} min read</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/posts/${post.id}/edit`}>📝</Link>
                </Button>
              </div>
            ))}
            {recentPosts.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-3">No posts yet.</p>
            )}
          </div>
        </Card>

        {/* Recent Comments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Comments</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/comments">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentComments.map((comment) => (
              <div key={comment.id} className="py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        comment.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : comment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {comment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{comment.content}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">on &quot;{comment.postTitle}&quot;</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Approve"
                      onClick={() => handleCommentStatus(comment, 'approved')}
                    >
                      ✅
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Mark as spam"
                      onClick={() => handleCommentStatus(comment, 'spam')}
                    >
                      ❌
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {recentComments.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-3">No comments yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Posts by Category */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Posts by Category</h2>
        <div className="space-y-4">
          {categoryCounts.map((category) => (
            <div key={category.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {category.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category.count} {category.count === 1 ? 'post' : 'posts'}
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
    </div>
  )
}

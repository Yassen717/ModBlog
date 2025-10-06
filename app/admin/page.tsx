'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Mock data for demo
const stats = [
  { name: 'Total Posts', value: '24', change: '+2', changeType: 'increase' },
  { name: 'Total Views', value: '12.3K', change: '+5.2%', changeType: 'increase' },
  { name: 'Comments', value: '89', change: '+12', changeType: 'increase' },
  { name: 'Subscribers', value: '1,234', change: '-2', changeType: 'decrease' },
]

const recentPosts = [
  { id: 1, title: 'Getting Started with Next.js 14', status: 'Published', date: '2024-01-15', views: 1234 },
  { id: 2, title: 'Mastering TypeScript Advanced Types', status: 'Draft', date: '2024-01-14', views: 856 },
  { id: 3, title: 'Building Responsive Layouts', status: 'Published', date: '2024-01-13', views: 2341 },
  { id: 4, title: 'React Server Components Guide', status: 'Published', date: '2024-01-12', views: 1876 },
]

const recentComments = [
  { id: 1, author: 'Alice Johnson', content: 'Great article! Very helpful...', post: 'Next.js 14 Guide', date: '2 hours ago' },
  { id: 2, author: 'Bob Smith', content: 'Could you explain more about...', post: 'TypeScript Types', date: '4 hours ago' },
  { id: 3, author: 'Carol Davis', content: 'This solved my problem!', post: 'CSS Layouts', date: '1 day ago' },
]

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

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
          <a href="/admin/posts/new">✍️ New Post</a>
        </Button>
        <Button variant="secondary">
          📊 View Analytics
        </Button>
        <Button variant="secondary">
          💬 Moderate Comments
        </Button>
        <Button variant="secondary">
          📧 Email Subscribers
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
              <div className={`text-sm font-medium ${
                stat.changeType === 'increase' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.changeType === 'increase' ? '↗️' : '↘️'} {stat.change}
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
              <a href="/admin/posts">View All</a>
            </Button>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'Published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.views} views</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  📝
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Comments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Comments</h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/admin/comments">View All</a>
            </Button>
          </div>
          <div className="space-y-4">
            {recentComments.map((comment) => (
              <div key={comment.id} className="py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{comment.content}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">on &quot;{comment.post}&quot;</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">✅</Button>
                    <Button variant="ghost" size="sm">❌</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Chart Placeholder */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activity Overview</h2>
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600 dark:text-gray-400">Chart visualization would go here</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Posts, views, and engagement over time</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
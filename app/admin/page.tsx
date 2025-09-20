'use client'

import { useEffect, useState } from 'react'
import { Post } from '@/types/blog'
import { getPosts, deletePost } from '@/lib/storage'
import { AdminAuth } from '@/components/admin/admin-auth'
import { PostManager } from '@/components/admin/post-manager'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadPosts()
    } else {
      setLoading(false)
    }
  }, [])

  const loadPosts = () => {
    try {
      const allPosts = getPosts()
      setPosts(allPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      loadPosts()
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
  }

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(postId)
      loadPosts()
    }
  }

  const refreshPosts = () => {
    loadPosts()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminAuth onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your blog posts and content
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {posts.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {posts.filter(p => p.status === 'published').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</h3>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {posts.filter(p => p.status === 'draft').length}
            </p>
          </div>
        </div>

        {/* Post Manager */}
        <PostManager 
          posts={posts} 
          onDeletePost={handleDeletePost}
          onRefresh={refreshPosts}
        />
      </div>
    </div>
  )
}
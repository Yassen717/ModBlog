'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Post } from '@/types/blog'
import { getAllPosts, savePost, deletePost } from '@/lib/storage'

const statusColors = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
}

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<{id: string, title: string} | null>(null)

  // Fetch posts from localStorage directly instead of API
  useEffect(() => {
    fetchPosts()
  }, [])
  
  // Refresh posts when page becomes visible (e.g., returning from create page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPosts()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      
      // Get posts directly from localStorage
      const allPosts = getAllPosts()
      setPosts(allPosts)
      
      console.log('Loaded posts from localStorage:', allPosts.length)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteClick = (id: string, title: string) => {
    setPostToDelete({id, title});
    setIsDeleteModalOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    
    try {
      // Delete from localStorage directly
      const success = deletePost(postToDelete.id);
      
      if (success) {
        // Update the state immediately without page refresh
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete.id));
        console.log('Post deleted successfully:', postToDelete.id);
      } else {
        alert('Failed to delete post - post not found');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    } finally {
      setPostToDelete(null);
      setIsDeleteModalOpen(false);
    }
  }

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'published') => {
    try {
      // Find the current post data
      const currentPost = posts.find(post => post.id === id)
      if (!currentPost) {
        alert('Post not found')
        return
      }

      // Update the post directly in localStorage
      const updatedPost = {
        ...currentPost,
        status: newStatus,
        updatedAt: new Date()
      }
      
      // Save to localStorage
      savePost(updatedPost)
      
      // Update the state immediately
      setPosts(posts.map(post => 
        post.id === id ? updatedPost : post
      ))
      
      console.log(`Post status changed to ${newStatus}:`, updatedPost)
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Error updating post')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
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
            </select>
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
            {posts.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length) || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Reading Time</div>
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
                  Reading Time
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
                        by {post.author.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={post.status}
                      onChange={(e) => handleStatusChange(post.id, e.target.value as 'draft' | 'published')}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${statusColors[post.status as keyof typeof statusColors]}`}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {post.category.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {post.readingTime} min read
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {post.publishedAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>📝</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`}>👁️</Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(post.id, post.title)} type="button">
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredPosts.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No posts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first blog post.'}
          </p>
          <Button asChild>
            <Link href="/admin/posts/new">Create First Post</Link>
          </Button>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal
        title="Delete Post"
        description={`Are you sure you want to delete the post "${postToDelete?.title || ''}"? This action cannot be undone.`}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        confirmVariant="default"
      />
    </div>
  )
}
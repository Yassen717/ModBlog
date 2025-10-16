'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Comment } from '@/types/blog'

const statusColors = {
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  spam: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

export default function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  // Load comments from localStorage on mount
  useEffect(() => {
    loadComments()
  }, [])
  
  // Refresh comments when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadComments()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const getCommentsFromLocalStorage = (): Comment[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const data = localStorage.getItem('blog_comments')
      const comments = data ? JSON.parse(data) : []
      
      // Convert date strings to Date objects
      return comments.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      }))
    } catch (error) {
      console.error('Error reading comments from localStorage:', error)
      return []
    }
  }

  const saveCommentToLocalStorage = (comment: Comment) => {
    if (typeof window === 'undefined') return
    
    try {
      const comments = getCommentsFromLocalStorage()
      const existingIndex = comments.findIndex(c => c.id === comment.id)
      
      if (existingIndex >= 0) {
        comments[existingIndex] = { ...comment, updatedAt: new Date() }
      } else {
        comments.push({ ...comment, createdAt: new Date(), updatedAt: new Date() })
      }
      
      localStorage.setItem('blog_comments', JSON.stringify(comments))
    } catch (error) {
      console.error('Error saving comment to localStorage:', error)
    }
  }

  const deleteCommentFromLocalStorage = (id: string): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      const comments = getCommentsFromLocalStorage()
      const initialLength = comments.length
      const filteredComments = comments.filter(comment => comment.id !== id)
      
      if (filteredComments.length === initialLength) {
        return false // Comment not found
      }
      
      localStorage.setItem('blog_comments', JSON.stringify(filteredComments))
      return true
    } catch (error) {
      console.error('Error deleting comment from localStorage:', error)
      return false
    }
  }

  const loadComments = () => {
    try {
      setLoading(true)
      const allComments = getCommentsFromLocalStorage()
      setComments(allComments)
      console.log('Loaded comments from localStorage:', allComments.length)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (id: string, newStatus: Comment['status']) => {
    try {
      const commentToUpdate = comments.find(comment => comment.id === id)
      if (!commentToUpdate) return
      
      const updatedComment: Comment = {
        ...commentToUpdate,
        status: newStatus,
        updatedAt: new Date(),
      }
      
      // Save to localStorage
      saveCommentToLocalStorage(updatedComment)
      
      // Update local state
      setComments(comments.map(comment => 
        comment.id === id ? updatedComment : comment
      ))
      
      console.log('Comment status updated:', updatedComment)
    } catch (error) {
      console.error('Error updating comment status:', error)
      alert('Error updating comment status')
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        // Delete from localStorage
        const success = deleteCommentFromLocalStorage(id)
        
        if (success) {
          // Update local state
          setComments(comments.filter(comment => comment.id !== id))
          console.log('Comment deleted successfully:', id)
        } else {
          alert('Failed to delete comment - comment not found')
        }
      } catch (error) {
        console.error('Error deleting comment:', error)
        alert('Error deleting comment')
      }
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedComments.length === 0) {
      alert('Please select comments first')
      return
    }

    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedComments.length} comments?`)) {
        try {
          // Delete from localStorage
          selectedComments.forEach(id => deleteCommentFromLocalStorage(id))
          
          // Update local state
          setComments(comments.filter(comment => !selectedComments.includes(comment.id)))
          setSelectedComments([])
          console.log('Bulk delete completed')
        } catch (error) {
          console.error('Error in bulk delete:', error)
          alert('Error deleting comments')
        }
      }
    } else {
      try {
        // Update status for selected comments
        const updatedComments = comments.map(comment => {
          if (selectedComments.includes(comment.id)) {
            const updated = {
              ...comment,
              status: action as Comment['status'],
              updatedAt: new Date(),
            }
            saveCommentToLocalStorage(updated)
            return updated
          }
          return comment
        })
        
        setComments(updatedComments)
        setSelectedComments([])
        console.log('Bulk status update completed')
      } catch (error) {
        console.error('Error in bulk status update:', error)
        alert('Error updating comment status')
      }
    }
  }

  const toggleCommentSelection = (id: string) => {
    setSelectedComments(prev => 
      prev.includes(id) 
        ? prev.filter(commentId => commentId !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([])
    } else {
      setSelectedComments(filteredComments.map(comment => comment.id))
    }
  }

  const startReply = (commentId: string) => {
    setReplyingTo(commentId)
    setReplyContent('')
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyContent('')
  }

  const submitReply = (parentCommentId: string) => {
    if (!replyContent.trim()) {
      alert('Please enter a reply')
      return
    }

    try {
      const parentComment = comments.find(comment => comment.id === parentCommentId)
      if (!parentComment) return

      // Create reply comment
      const reply: Comment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        author: 'Admin', // In a real app, this would be the logged-in user
        email: 'admin@blog.com', // In a real app, this would be the user's email
        content: replyContent,
        postId: parentComment.postId,
        postTitle: parentComment.postTitle,
        postSlug: parentComment.postSlug,
        status: 'approved', // Replies from admin are automatically approved
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Add reply to parent comment
      const updatedParentComment: Comment = {
        ...parentComment,
        replies: parentComment.replies ? [...parentComment.replies, reply] : [reply],
        updatedAt: new Date(),
      }

      // Save both comments
      saveCommentToLocalStorage(reply)
      saveCommentToLocalStorage(updatedParentComment)

      // Update local state
      setComments(comments.map(comment => 
        comment.id === parentCommentId ? updatedParentComment : comment
      ))

      // Reset reply state
      setReplyingTo(null)
      setReplyContent('')
      
      console.log('Reply submitted:', reply)
    } catch (error) {
      console.error('Error submitting reply:', error)
      alert('Error submitting reply')
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comments</h1>
          <p className="text-gray-600 dark:text-gray-400">Moderate and manage blog comments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="secondary">
            💬 Comment Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {comments.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Comments</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {comments.filter(c => c.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {comments.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {comments.filter(c => c.status === 'spam').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Spam</div>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search comments, authors, or posts..."
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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedComments.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-300">
                {selectedComments.length} comments selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleBulkAction('approved')}>
                  ✅ Approve
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleBulkAction('pending')}>
                  ⏳ Mark Pending
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleBulkAction('spam')}>
                  🚫 Mark Spam
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleBulkAction('delete')}>
                  🗑️ Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Comments List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
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
              {filteredComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => toggleCommentSelection(comment.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-3">
                        {comment.content}
                      </p>
                      {comment.replies && comment.replies.length > 0 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {comment.replies.length} replies
                        </p>
                      )}
                    </div>
                    
                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button size="sm" variant="secondary" onClick={cancelReply}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => submitReply(comment.id)}>
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-900 dark:text-white truncate">
                        {comment.postTitle}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/blog/${comment.postSlug}`} className="text-xs text-blue-600 dark:text-blue-400">
                          View Post
                        </a>
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={comment.status}
                      onChange={(e) => handleStatusChange(comment.id, e.target.value as Comment['status'])}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${statusColors[comment.status as keyof typeof statusColors]}`}
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="spam">Spam</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {comment.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => startReply(comment.id)}>
                        💬
                      </Button>
                      <Button variant="ghost" size="sm">
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)}>
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
      {filteredComments.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No comments found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Comments from your blog posts will appear here.'}
          </p>
        </Card>
      )}

      {/* Moderation Tips */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          💡 Moderation Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-green-600 dark:text-green-400">Approve</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Constructive feedback</li>
              <li>• Relevant questions</li>
              <li>• Helpful additions</li>
              <li>• Positive engagement</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-yellow-600 dark:text-yellow-400">Review</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• First-time commenters</li>
              <li>• Comments with links</li>
              <li>• Questionable language</li>
              <li>• Off-topic content</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-red-600 dark:text-red-400">Block/Spam</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Promotional content</li>
              <li>• Offensive language</li>
              <li>• Irrelevant links</li>
              <li>• Harassment</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
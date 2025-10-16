'use client'

import { useState, useEffect } from 'react'
import { Comment } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface CommentsSectionProps {
  postId: string
  postTitle: string
  postSlug: string
}

export function CommentsSection({ postId, postTitle, postSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState({
    author: '',
    email: '',
    content: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Load comments for this post
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setLoading(true)
      
      // Try to get comments from localStorage first
      const commentsFromStorage = getCommentsFromLocalStorage()
      const postComments = commentsFromStorage.filter((c: Comment) => c.postId === postId)
      
      // Filter only approved comments for display
      const approvedComments = postComments.filter((c: Comment) => c.status === 'approved')
      setComments(approvedComments)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewComment(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.author || !newComment.email || !newComment.content) {
      setSubmitError('Please fill in all fields')
      return
    }
    
    try {
      setSubmitting(true)
      setSubmitError('')
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newComment,
          postId,
          postTitle,
          postSlug
        }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.persist && data.comment) {
        // Save the comment to localStorage
        saveCommentToLocalStorage(data.comment)
        
        // Reload comments to show the new one (it will be pending, so won't show immediately)
        loadComments()
        
        setSubmitSuccess(true)
        setNewComment({ author: '', email: '', content: '' })
        
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        setSubmitError(data.error || 'Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      setSubmitError('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>
        <p>Loading comments...</p>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h2>
      
      {/* Comment Form */}
      <Card className="p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Leave a Comment
        </h3>
        
        {submitSuccess && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
            Your comment has been submitted and is pending moderation. Thank you!
          </div>
        )}
        
        {submitError && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <Input
                type="text"
                id="author"
                name="author"
                value={newComment.author}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={newComment.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comment *
            </label>
            <textarea
              id="content"
              name="content"
              value={newComment.content}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your comment here..."
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {comment.author}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {comment.status === 'approved' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Approved
                  </span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        </Card>
      )}
    </div>
  )
}
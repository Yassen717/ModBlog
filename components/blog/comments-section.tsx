'use client'

import { useState, useEffect, useCallback } from 'react'
import { Comment } from '@/types/blog'
import { getCommentsByPost, addComment, getSettings } from '@/lib/storage'
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
  const [enabled, setEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState({
    author: '',
    email: '',
    content: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const loadComments = useCallback(() => {
    try {
      setLoading(true)

      if (getSettings()?.content.enableComments === false) {
        setEnabled(false)
        return
      }

      setComments(getCommentsByPost(postId).filter((c) => c.status === 'approved'))
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewComment(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.author || !newComment.email || !newComment.content) {
      setSubmitError('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      setSubmitError('')

      addComment({
        ...newComment,
        postId,
        postTitle,
        postSlug
      })

      loadComments()

      setSubmitSuccess(true)
      setNewComment({ author: '', email: '', content: '' })

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting comment:', error)
      setSubmitError('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!enabled) {
    return null
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
            <div key={comment.id}>
              <Card className="p-6">
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

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-8 space-y-4">
                  {comment.replies.map((reply) => (
                    <Card key={reply.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {reply.author}
                          </h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {reply.content}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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

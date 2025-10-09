'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { sampleCategories, sampleAuthor } from '@/lib/sample-data'
import { Category } from '@/types/blog'
import { getCategories } from '@/lib/storage'

export default function CreatePostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categoryId: '',
    tags: '',
    status: 'draft' as 'draft' | 'published'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])
  
  // Refresh categories when page becomes visible (e.g., returning from categories page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCategories()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const loadCategories = async () => {
    try {
      // Get categories directly from localStorage
      const allCategories = getCategories()
      
      if (allCategories.length > 0) {
        console.log('Categories loaded from localStorage:', allCategories)
        setCategories(allCategories)
      } else {
        console.log('No categories in localStorage, using sample categories')
        // Fallback to sample categories if localStorage is empty
        setCategories(sampleCategories)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      console.log('Error occurred, using sample categories')
      setCategories(sampleCategories)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use the current form data for direct form submission
    await submitPost(formData)
  }

  const handleSaveAsDraft = async () => {
    // Set status to draft and submit
    const draftFormData = { ...formData, status: 'draft' as const }
    setFormData(draftFormData)
    
    if (!validateForm()) {
      return
    }

    await submitPost(draftFormData)
  }

  const handlePublish = async () => {
    // Set status to published and submit
    const publishedFormData = { ...formData, status: 'published' as const }
    setFormData(publishedFormData)
    
    if (!validateForm()) {
      return
    }

    await submitPost(publishedFormData)
  }

  const submitPost = async (formDataToSubmit: typeof formData) => {
    setLoading(true)
    setErrors({})

    try {
      const selectedCategory = categories.find(cat => cat.id === formDataToSubmit.categoryId)
      
      if (!selectedCategory) {
        setErrors({ categoryId: 'Invalid category selected' })
        return
      }

      const postData = {
        title: formDataToSubmit.title,
        slug: formDataToSubmit.slug,
        excerpt: formDataToSubmit.excerpt,
        content: formDataToSubmit.content,
        featuredImage: formDataToSubmit.featuredImage || undefined,
        author: sampleAuthor,
        category: selectedCategory,
        tags: formDataToSubmit.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
        status: formDataToSubmit.status,
        publishedAt: formDataToSubmit.status === 'published' ? new Date().toISOString() : undefined
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Post created successfully:', data)
        
        // If the API tells us to persist, save to localStorage
        if (data.persist && data.post) {
          try {
            // Get existing posts from localStorage
            const existingPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]')
            
            // Add the new post
            existingPosts.push(data.post)
            
            // Save back to localStorage
            localStorage.setItem('blog_posts', JSON.stringify(existingPosts))
            
            console.log('Post saved to localStorage:', data.post)
          } catch (error) {
            console.error('Failed to save post to localStorage:', error)
          }
        }
        
        // Clear any previous errors and show success
        const statusText = formDataToSubmit.status === 'published' ? 'published' : 'saved as draft'
        setErrors({ success: `Post ${statusText} successfully! Redirecting...` })
        
        // Add a small delay to show the success state
        setTimeout(() => {
          router.push('/admin/posts')
        }, 1500)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Failed to create post' })
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
          <p className="text-gray-600 dark:text-gray-400">Write and publish a new blog post</p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/admin/posts">← Back to Posts</Link>
        </Button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full"
                  disabled={loading}
                />
                {errors.title && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug
                </label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-slug"
                  className="w-full"
                  disabled={loading}
                />
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  URL: /blog/{formData.slug || 'post-slug'}
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of your post..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  disabled={loading}
                />
                {errors.excerpt && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.excerpt}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content here..."
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y"
                  disabled={loading}
                />
                {errors.content && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.content}</p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Supports Markdown formatting
                </p>
              </div>

              {/* Error Display */}
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
                  {errors.submit}
                </div>
              )}
              
              {/* Success Display */}
              {errors.success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md">
                  ✅ {errors.success}
                </div>
              )}
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Publish
            </h3>
            <div className="space-y-3">
              <Button
                onClick={handleSaveAsDraft}
                variant="secondary"
                className="w-full"
                disabled={loading}
              >
                {loading && formData.status === 'draft' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  '📄 Save as Draft'
                )}
              </Button>
              <Button
                onClick={handlePublish}
                className="w-full"
                disabled={loading}
              >
                {loading && formData.status === 'published' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  '🚀 Publish Now'
                )}
              </Button>
            </div>
          </Card>

          {/* Category */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Category
            </h3>
            {categories.length === 0 && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  No categories available. Please create categories first or refresh the page.
                </p>
              </div>
            )}
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={loading}
            >
              <option value="">Select a category ({categories.length} available)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.categoryId}</p>
            )}
          </Card>

          {/* Featured Image */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Featured Image
            </h3>
            <Input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="w-full"
              disabled={loading}
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Optional: URL to featured image
            </p>
            {formData.featuredImage && (
              <div className="mt-3">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tags
            </h3>
            <Input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="React, Next.js, TypeScript"
              className="w-full"
              disabled={loading}
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Separate tags with commas
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
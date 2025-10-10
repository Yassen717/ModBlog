'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Category } from '@/types/blog'
import { getCategories, saveCategory } from '@/lib/storage'
import { getAllPosts } from '@/lib/storage'

// Extended category type with post count for admin display
type CategoryWithCount = Category & { postCount: number }

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6',
  })

  // Load categories from localStorage on mount
  useEffect(() => {
    loadCategories()
  }, [])
  
  // Refresh categories when page becomes visible
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

  const loadCategories = () => {
    try {
      const allCategories = getCategories()
      const allPosts = getAllPosts()
      
      // Add post counts to categories
      const categoriesWithCounts = allCategories.map(category => ({
        ...category,
        postCount: allPosts.filter(post => post.category.id === category.id).length
      }))
      
      setCategories(categoriesWithCounts)
      console.log('Loaded categories from localStorage:', categoriesWithCounts.length)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      // Update category
      const updatedCategory: Category = {
        id: editingId,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        color: formData.color
      }
      
      // Save to localStorage
      saveCategory(updatedCategory)
      
      // Update local state
      setCategories(categories.map(cat => 
        cat.id === editingId 
          ? { ...updatedCategory, postCount: cat.postCount }
          : cat
      ))
      setEditingId(null)
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        color: formData.color
      }
      
      // Save to localStorage
      saveCategory(newCategory)
      
      // Update local state
      setCategories([...categories, { ...newCategory, postCount: 0 }])
      setIsCreating(false)
    }
    
    setFormData({ name: '', slug: '', description: '', color: '#3B82F6' })
    console.log('Category saved successfully')
  }

  const handleEdit = (category: CategoryWithCount) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
    })
    setIsCreating(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        // Remove from localStorage by filtering and saving
        const allCategories = getCategories()
        const filteredCategories = allCategories.filter(cat => cat.id !== id)
        
        // Save the filtered categories back
        // Since we need to save all categories, we'll overwrite localStorage
        localStorage.setItem('blog_categories', JSON.stringify(filteredCategories))
        
        // Update local state
        setCategories(categories.filter(cat => cat.id !== id))
        console.log('Category deleted successfully:', id)
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Error deleting category')
      }
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '', color: '#3B82F6' })
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize your content with categories</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          🏷️ New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {categories.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Categories</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(categories.reduce((sum, cat) => sum + cat.postCount, 0) / categories.length)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Posts/Category</div>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Edit Category' : 'Create New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Web Development"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug *
                </label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., web-development"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="w-32"
                />
                <div className="flex space-x-2">
                  {['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#6B7280'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button type="submit">
                {editingId ? 'Update Category' : 'Create Category'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    /{category.slug}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                  ✏️
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                  🗑️
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {category.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.postCount}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category.postCount === 1 ? 'post' : 'posts'}
                </span>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <a href={`/blog?category=${category.slug}`}>View Posts</a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && !isCreating && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No categories yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first category to start organizing your content.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            Create First Category
          </Button>
        </Card>
      )}
    </div>
  )
}
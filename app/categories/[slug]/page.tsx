'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Post, Category } from '@/types/blog'
import { getCategories, getPostsByCategory } from '@/lib/storage'
import { PostGrid } from '@/components/blog/post-grid'
import { Button } from '@/components/ui/button'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategoryData = () => {
      try {
        const categories = getCategories()
        const foundCategory = categories.find(c => c.slug === params.slug)
        
        if (!foundCategory) {
          notFound()
          return
        }
        
        setCategory(foundCategory)
        
        const categoryPosts = getPostsByCategory(foundCategory.id)
        setPosts(categoryPosts)
      } catch (error) {
        console.error('Error loading category data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!category) {
    notFound()
  }

  return (
    <div className="py-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
            Home
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-gray-700 dark:hover:text-gray-300">
            Categories
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">{category.name}</span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: category.color }}
            >
              {category.name.charAt(0)}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {category.name}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            {category.description}
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{posts.length} {posts.length === 1 ? 'article' : 'articles'}</span>
            <span>•</span>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/search?category=${category.id}`}>
                Search in {category.name}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4">
        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Articles Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no articles in the {category.name} category yet.
              </p>
              <div className="space-x-3">
                <Button variant="secondary" asChild>
                  <Link href="/categories">
                    Browse Other Categories
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/blog">
                    View All Articles
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
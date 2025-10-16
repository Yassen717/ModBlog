'use client'

import { useEffect, useState } from 'react'
import { Post, Category } from '@/types/blog'
import { getPublishedPosts, getCategories } from '@/lib/storage'
import { HeroSection } from '@/components/blog/hero-section'
import { PostGrid } from '@/components/blog/post-grid'
import { CategoriesSection } from '@/components/blog/categories-section'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      try {
        const allPosts = getPublishedPosts()
        const allCategories = getCategories()
        
        setPosts(allPosts)
        setCategories(allCategories)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const featuredPost = posts[0] // Use the most recent post as featured
  const recentPosts = posts.slice(1, 7) // Show 6 recent posts after the featured one

  return (
    <div>
      {/* Hero Section */}
      <HeroSection featuredPost={featuredPost} />
      
      {/* Recent Posts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Latest Articles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay up to date with the latest trends and insights in web development.
            </p>
          </div>
          
          <PostGrid posts={recentPosts} />
          
          {posts.length > 7 && (
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <CategoriesSection categories={categories} />
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest articles and insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

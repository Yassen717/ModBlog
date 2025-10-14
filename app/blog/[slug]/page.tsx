'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { Post } from '@/types/blog'
import { getPostBySlug, getPublishedPosts } from '@/lib/storage'
import { PostDetail } from '@/components/blog/post-detail'
import { PostNavigation } from '@/components/blog/post-navigation'
import { RelatedPosts } from '@/components/blog/related-posts'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [navigation, setNavigation] = useState<{
    previous: Post | null
    next: Post | null
  }>({ previous: null, next: null })
  const [loading, setLoading] = useState(true)
  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const resolvedParams = await params
        setResolvedSlug(resolvedParams.slug)
        
        const foundPost = getPostBySlug(resolvedParams.slug)
        
        if (!foundPost) {
          notFound()
          return
        }

        setPost(foundPost)

        // Get all posts for navigation and related posts
        const allPosts = getPublishedPosts()
        const currentIndex = allPosts.findIndex(p => p.id === foundPost.id)
        
        // Set navigation
        setNavigation({
          previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
          next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
        })

        // Get related posts (same category, excluding current post)
        const related = allPosts
          .filter(p => p.id !== foundPost.id && p.category.id === foundPost.category.id)
          .slice(0, 3)
        
        setRelatedPosts(related)
      } catch (error) {
        console.error('Error loading post:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return (
    <div>
      <PostDetail post={post} />
      <PostNavigation previous={navigation.previous} next={navigation.next} />
      {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
    </div>
  )
}
'use client'

import { Suspense, useEffect, useState } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { Post } from '@/types/blog'
import { getPostById, getPostBySlug, getPublishedPosts } from '@/lib/storage'
import { PostDetail } from '@/components/blog/post-detail'
import { PostNavigation } from '@/components/blog/post-navigation'
import { RelatedPosts } from '@/components/blog/related-posts'
import { CommentsSection } from '@/components/blog/comments-section'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

function BlogPostContent({ params }: BlogPostPageProps) {
  const searchParams = useSearchParams()
  const isPreview = searchParams.get('preview') === '1'

  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [navigation, setNavigation] = useState<{
    previous: Post | null
    next: Post | null
  }>({ previous: null, next: null })
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const resolvedParams = await params

        const foundPost = isPreview
          ? getPostById(resolvedParams.slug) || getPostBySlug(resolvedParams.slug)
          : getPostBySlug(resolvedParams.slug)

        if (!foundPost) {
          setMissing(true)
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
        setMissing(true)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [params, isPreview])

  if (loading) {
    return <LoadingSpinner />
  }

  if (missing || !post) {
    notFound()
  }

  return (
    <div>
      <PostDetail post={post} />
      <CommentsSection 
        postId={post.id} 
        postTitle={post.title} 
        postSlug={post.slug} 
      />
      <PostNavigation previous={navigation.previous} next={navigation.next} />
      {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
    </div>
  )
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}

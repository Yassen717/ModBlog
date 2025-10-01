'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/blog'
import { getPosts } from '@/lib/storage'
import { PostEditor } from '@/components/admin/post-editor'

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus !== 'true') {
      router.push('/admin')
      return
    }

    setIsAuthenticated(true)

    // Find the post
    const posts = getPosts()
    const foundPost = posts.find(p => p.id === params.id)
    
    if (!foundPost) {
      router.push('/admin')
      return
    }

    setPost(foundPost)
    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <PostEditor post={post} />
      </div>
    </div>
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { Post } from '@/types/blog'
import { getPublishedPosts, getAllPosts, createPost } from '@/lib/storage'
import { generateSlug, calculateReadingTime, generateId } from '@/lib/utils'
import { samplePosts } from '@/lib/sample-data'

// GET /api/posts - Get all posts (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')

    let posts: Post[]

    // Get posts based on status filter
    if (status === 'published') {
      posts = getPublishedPosts()
    } else {
      posts = getAllPosts()
    }
    
    // If no posts found (server-side), fallback to sample posts
    if (posts.length === 0) {
      posts = samplePosts
    }

    // Apply additional filters
    if (category) {
      posts = posts.filter(post => post.category.slug === category)
    }

    if (author) {
      posts = posts.filter(post => post.author.id === author)
    }

    if (status) {
      posts = posts.filter(post => post.status === status)
    }

    // Apply pagination
    if (limit) {
      const limitNum = parseInt(limit)
      const pageNum = parseInt(page || '1')
      const startIndex = (pageNum - 1) * limitNum
      const endIndex = startIndex + limitNum
      
      const paginatedPosts = posts.slice(startIndex, endIndex)
      
      return NextResponse.json({
        posts: paginatedPosts,
        pagination: {
          total: posts.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(posts.length / limitNum)
        }
      })
    }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    // Fallback to sample posts on error
    return NextResponse.json({ posts: samplePosts })
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, excerpt' },
        { status: 400 }
      )
    }

    // Generate slug from title if not provided
    const slug = body.slug || generateSlug(body.title)
    
    // Calculate reading time
    const readingTime = calculateReadingTime(body.content)

    // Generate unique ID
    const id = generateId()

    const newPost: Post = {
      id,
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage,
      author: body.author,
      category: body.category,
      tags: body.tags || [],
      publishedAt: body.status === 'published' ? new Date() : new Date(body.publishedAt || Date.now()),
      updatedAt: new Date(),
      status: body.status || 'draft',
      readingTime
    }

    // Since we're in server context, we'll return the post for client-side storage
    // In a real app, this would save to a database
    console.log('Created new post:', newPost)
    
    return NextResponse.json({ 
      post: newPost,
      message: 'Post created successfully',
      // Tell client to persist the data
      persist: true
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
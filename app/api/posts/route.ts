import { NextRequest, NextResponse } from 'next/server'
import { Post } from '@/types/blog'
import { getPublishedPosts, getAllPosts, createPost } from '@/lib/storage'
import { generateSlug, calculateReadingTime } from '@/lib/utils'

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
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
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

    const newPost: Omit<Post, 'id'> = {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage,
      author: body.author, // Should be set from authenticated user
      category: body.category,
      tags: body.tags || [],
      publishedAt: body.status === 'published' ? new Date() : new Date(body.publishedAt || Date.now()),
      updatedAt: new Date(),
      status: body.status || 'draft',
      readingTime
    }

    const createdPost = createPost(newPost)
    
    return NextResponse.json({ post: createdPost }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
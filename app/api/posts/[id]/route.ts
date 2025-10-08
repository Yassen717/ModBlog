import { NextRequest, NextResponse } from 'next/server'
import { updatePost, deletePost, getPostById } from '@/lib/storage'
import { calculateReadingTime } from '@/lib/utils'

// GET /api/posts/[id] - Get single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = getPostById(id)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const existingPost = getPostById(id)
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Calculate reading time if content changed
    const readingTime = body.content !== existingPost.content 
      ? calculateReadingTime(body.content)
      : existingPost.readingTime

    const updatedData = {
      ...existingPost,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
      readingTime,
      // Update publishedAt only if status changes to published
      publishedAt: body.status === 'published' && existingPost.status !== 'published'
        ? new Date()
        : existingPost.publishedAt
    }

    const updatedPost = updatePost(id, updatedData)
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = deletePost(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
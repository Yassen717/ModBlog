import { NextRequest, NextResponse } from 'next/server'
import { Post } from '@/types/blog'
import { getPostById, updatePost, deletePost } from '@/lib/storage'

// GET /api/posts/[id] - Get single post
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
    console.error('Error fetching post:', error)
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
    
    console.log('PUT request for post ID:', id, 'with data:', body)
    
    // Since we can't access localStorage on server-side,
    // we'll let the client handle all the data and just validate the update
    
    // For status updates, we expect the client to send the current post data
    if (!body.currentPost) {
      return NextResponse.json(
        { error: 'Current post data required for update' },
        { status: 400 }
      )
    }

    // Create the updated post with new data
    const updatedPost: Post = {
      ...body.currentPost,
      ...body.updates, // Apply the updates (like status change)
      id, // Ensure ID doesn't change
      updatedAt: new Date()
    }

    console.log('Updated post on server:', updatedPost)
    
    return NextResponse.json({ 
      post: updatedPost,
      message: 'Post updated successfully',
      // Tell client to persist the updated data
      persist: true
    })
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
    
    // For server-side, we'll just return success
    // Client will handle the actual deletion from localStorage
    console.log('Delete post request for ID:', id)
    
    return NextResponse.json({ 
      message: 'Post deleted successfully',
      // Tell client to remove the post from localStorage
      persist: true,
      action: 'delete',
      postId: id
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
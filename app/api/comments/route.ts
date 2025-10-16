import { NextRequest, NextResponse } from 'next/server'
import { Comment } from '@/types/blog'
import { generateId } from '@/lib/utils'

// Since we're in a server context, we need to manage comments differently
// We'll return instructions to the client to persist the data

// GET /api/comments - Get all comments or filter by post or status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const status = searchParams.get('status') as Comment['status'] | null
    
    // In a real app, this would fetch from a database
    // For now, we'll return empty array and let client fetch from localStorage
    return NextResponse.json({ 
      comments: [],
      message: 'Client should fetch comments from localStorage',
      fetchFromLocalStorage: true
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.author || !body.email || !body.content || !body.postId) {
      return NextResponse.json(
        { error: 'Missing required fields: author, email, content, postId' },
        { status: 400 }
      )
    }
    
    const newComment: Comment = {
      id: generateId(),
      author: body.author,
      email: body.email,
      content: body.content,
      postId: body.postId,
      postTitle: body.postTitle || '',
      postSlug: body.postSlug || '',
      status: 'pending', // Default to pending for moderation
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    // Since we're in server context, we'll return the comment for client-side storage
    // In a real app, this would save to a database
    return NextResponse.json({ 
      comment: newComment,
      message: 'Comment submitted successfully and is pending moderation',
      persist: true
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    )
  }
}
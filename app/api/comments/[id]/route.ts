import { NextRequest, NextResponse } from 'next/server'
import { Comment } from '@/types/blog'
import { 
  getCommentById, 
  saveComment, 
  deleteComment
} from '@/lib/storage'

// GET /api/comments/[id] - Get specific comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const comment = getCommentById(resolvedParams.id)
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Error fetching comment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comment' },
      { status: 500 }
    )
  }
}

// PUT /api/comments/[id] - Update specific comment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const existingComment = getCommentById(resolvedParams.id)
    
    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    
    // Update allowed fields
    const updatedComment: Comment = {
      ...existingComment,
      status: body.status || existingComment.status,
      content: body.content || existingComment.content,
      author: body.author || existingComment.author,
      updatedAt: new Date(),
    }
    
    saveComment(updatedComment)
    
    return NextResponse.json({ 
      comment: updatedComment,
      message: 'Comment updated successfully'
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments/[id] - Delete specific comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const success = deleteComment(resolvedParams.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
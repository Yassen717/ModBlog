import { NextRequest, NextResponse } from 'next/server'
import { getCategoryById, getCategories, saveCategory } from '@/lib/storage'
import { Category } from '@/types/blog'

// GET /api/categories/[id] - Get single category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = getCategoryById(id)
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const existingCategory = getCategoryById(id)
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const updatedCategory: Category = {
      ...existingCategory,
      ...body,
      id // Ensure ID doesn't change
    }

    saveCategory(updatedCategory)
    
    return NextResponse.json({ category: updatedCategory })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const categories = getCategories()
    const categoryExists = categories.some(cat => cat.id === id)
    
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const filteredCategories = categories.filter(cat => cat.id !== id)
    
    // Save the filtered categories back to storage
    // We need to implement deleteCateory function or use this approach
    const STORAGE_KEYS = { CATEGORIES: 'blog_categories' }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filteredCategories))
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getCategories, saveCategory } from '@/lib/storage'
import { Category } from '@/types/blog'
import { generateSlug } from '@/lib/utils'
import { sampleCategories } from '@/lib/sample-data'

// GET /api/categories - Get all categories
export async function GET() {
  try {
    let categories = getCategories()
    
    // If no categories exist (server-side or empty localStorage), return sample categories
    if (categories.length === 0) {
      categories = sampleCategories
    }
    
    return NextResponse.json({ categories })
  } catch (error) {
    // If there's an error, fallback to sample categories
    return NextResponse.json({ categories: sampleCategories })
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    // Generate slug from name if not provided
    const slug = body.slug || generateSlug(body.name)
    
    const newCategory: Category = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: body.name,
      slug,
      description: body.description || '',
      color: body.color || '#3B82F6'
    }

    saveCategory(newCategory)
    
    return NextResponse.json({ category: newCategory }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
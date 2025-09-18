export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  author: Author
  category: Category
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  status: 'draft' | 'published'
  readingTime: number
}

export interface Author {
  id: string
  name: string
  bio: string
  avatar?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    website?: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
}
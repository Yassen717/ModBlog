import { Post, Author, Category } from '@/types/blog'

const STORAGE_KEYS = {
  POSTS: 'blog_posts',
  AUTHORS: 'blog_authors',
  CATEGORIES: 'blog_categories',
} as const

// Generic storage utilities
export function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return []
  }
}

export function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error)
  }
}

// Post storage utilities
export function getPosts(): Post[] {
  const posts = getFromStorage<Post>(STORAGE_KEYS.POSTS)
  return posts.map(post => ({
    ...post,
    publishedAt: new Date(post.publishedAt),
    updatedAt: new Date(post.updatedAt),
  }))
}

export function savePost(post: Post): void {
  const posts = getPosts()
  const existingIndex = posts.findIndex(p => p.id === post.id)
  
  if (existingIndex >= 0) {
    posts[existingIndex] = { ...post, updatedAt: new Date() }
  } else {
    posts.push(post)
  }
  
  saveToStorage(STORAGE_KEYS.POSTS, posts)
}

export function deletePost(id: string): boolean {
  const posts = getPosts()
  const initialLength = posts.length
  const filteredPosts = posts.filter(post => post.id !== id)
  
  if (filteredPosts.length === initialLength) {
    return false // Post not found
  }
  
  saveToStorage(STORAGE_KEYS.POSTS, filteredPosts)
  return true
}

// Get all posts (including drafts) for admin
export function getAllPosts(): Post[] {
  return getPosts()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

// Get post by ID
export function getPostById(id: string): Post | undefined {
  const posts = getPosts()
  return posts.find(post => post.id === id)
}

// Create new post
export function createPost(postData: Omit<Post, 'id'>): Post {
  const newPost: Post = {
    ...postData,
    id: generateId(),
  }
  
  savePost(newPost)
  return newPost
}

// Update existing post
export function updatePost(id: string, postData: Partial<Post>): Post | null {
  const posts = getPosts()
  const existingIndex = posts.findIndex(p => p.id === id)
  
  if (existingIndex === -1) {
    return null
  }
  
  const updatedPost = {
    ...posts[existingIndex],
    ...postData,
    id, // Ensure ID doesn't change
    updatedAt: new Date()
  }
  
  posts[existingIndex] = updatedPost
  saveToStorage(STORAGE_KEYS.POSTS, posts)
  return updatedPost
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getPosts()
  return posts.find(post => post.slug === slug && post.status === 'published')
}

export function getPublishedPosts(): Post[] {
  return getPosts()
    .filter(post => post.status === 'published')
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

// Author storage utilities
export function getAuthors(): Author[] {
  return getFromStorage<Author>(STORAGE_KEYS.AUTHORS)
}

export function saveAuthor(author: Author): void {
  const authors = getAuthors()
  const existingIndex = authors.findIndex(a => a.id === author.id)
  
  if (existingIndex >= 0) {
    authors[existingIndex] = author
  } else {
    authors.push(author)
  }
  
  saveToStorage(STORAGE_KEYS.AUTHORS, authors)
}

export function getAuthorById(id: string): Author | undefined {
  const authors = getAuthors()
  return authors.find(author => author.id === id)
}

// Category storage utilities
export function getCategories(): Category[] {
  return getFromStorage<Category>(STORAGE_KEYS.CATEGORIES)
}

export function saveCategory(category: Category): void {
  const categories = getCategories()
  const existingIndex = categories.findIndex(c => c.id === category.id)
  
  if (existingIndex >= 0) {
    categories[existingIndex] = category
  } else {
    categories.push(category)
  }
  
  saveToStorage(STORAGE_KEYS.CATEGORIES, categories)
}

export function getCategoryById(id: string): Category | undefined {
  const categories = getCategories()
  return categories.find(category => category.id === id)
}

// Search and filter utilities
export function searchPosts(query: string): Post[] {
  const posts = getPublishedPosts()
  const lowercaseQuery = query.toLowerCase()
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getPostsByCategory(categoryId: string): Post[] {
  const posts = getPublishedPosts()
  return posts.filter(post => post.category.id === categoryId)
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getPublishedPosts()
  return posts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  )
}
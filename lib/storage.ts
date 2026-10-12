import { Post, Author, Category, User, Comment, BlogSettings } from '@/types/blog'
import { generateId } from '@/lib/utils'
import { samplePosts, sampleAuthor, sampleCategories, sampleUsers, getDefaultBlogSettings } from './sample-data'

const STORAGE_KEYS = {
  POSTS: 'blog_posts',
  AUTHORS: 'blog_authors',
  CATEGORIES: 'blog_categories',
  USERS: 'blog_users',
  COMMENTS: 'blog_comments',
  SETTINGS: 'blog_settings',
  SUBSCRIBERS: 'blog_subscribers',
} as const

// Generic storage utilities
export function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return []

  ensureSeeded(key)

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

// Lazily seed a storage key on first access so no getter can read before data exists
function ensureSeeded(key: string): void {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(key) !== null) return

  switch (key) {
    case STORAGE_KEYS.POSTS:
      saveToStorage(key, samplePosts)
      break
    case STORAGE_KEYS.AUTHORS:
      saveToStorage(key, [sampleAuthor])
      break
    case STORAGE_KEYS.CATEGORIES:
      saveToStorage(key, sampleCategories)
      break
    case STORAGE_KEYS.USERS:
      saveToStorage(key, sampleUsers)
      break
    case STORAGE_KEYS.SETTINGS:
      saveToStorage(key, [getDefaultSettings()])
      break
    case STORAGE_KEYS.COMMENTS:
    case STORAGE_KEYS.SUBSCRIBERS:
      saveToStorage(key, [])
      break
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

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getPosts()
  return posts.find(post => post.slug === slug && post.status === 'published')
}

export function getPublishedPosts(): Post[] {
  return getPosts()
    .filter(post => post.status === 'published')
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

// Ensure a post slug is unique by appending a numeric suffix if needed
export function ensureSlugUnique(slug: string, excludeId?: string): string {
  const posts = getPosts()
  let uniqueSlug = slug
  let suffix = 2

  while (posts.some(post => post.slug === uniqueSlug && post.id !== excludeId)) {
    uniqueSlug = `${slug}-${suffix}`
    suffix++
  }

  return uniqueSlug
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

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  const initialLength = categories.length
  const filteredCategories = categories.filter(category => category.id !== id)

  if (filteredCategories.length === initialLength) {
    return false // Category not found
  }

  saveToStorage(STORAGE_KEYS.CATEGORIES, filteredCategories)
  return true
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

// User storage utilities
export function getUsers(): User[] {
  const users = getFromStorage<User>(STORAGE_KEYS.USERS)
  return users.map(user => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  }))
}

export function saveUser(user: User): void {
  const users = getUsers()
  const existingIndex = users.findIndex(u => u.id === user.id)
  
  if (existingIndex >= 0) {
    users[existingIndex] = { ...user, updatedAt: new Date() }
  } else {
    users.push({ ...user, createdAt: new Date(), updatedAt: new Date() })
  }
  
  saveToStorage(STORAGE_KEYS.USERS, users)
}

export function getUserById(id: string): User | undefined {
  const users = getUsers()
  return users.find(user => user.id === id)
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const initialLength = users.length
  const filteredUsers = users.filter(user => user.id !== id)
  
  if (filteredUsers.length === initialLength) {
    return false // User not found
  }
  
  saveToStorage(STORAGE_KEYS.USERS, filteredUsers)
  return true
}

export function getUsersByRole(role: User['role']): User[] {
  const users = getUsers()
  return users.filter(user => user.role === role)
}

// Comment storage utilities
export function getComments(): Comment[] {
  const comments = getFromStorage<Comment>(STORAGE_KEYS.COMMENTS)
  return comments.map(comment => ({
    ...comment,
    createdAt: new Date(comment.createdAt),
    updatedAt: new Date(comment.updatedAt),
  }))
}

export function saveComment(comment: Comment): void {
  const comments = getComments()
  const existingIndex = comments.findIndex(c => c.id === comment.id)
  
  if (existingIndex >= 0) {
    comments[existingIndex] = { ...comment, updatedAt: new Date() }
  } else {
    comments.push({ ...comment, createdAt: new Date(), updatedAt: new Date() })
  }
  
  saveToStorage(STORAGE_KEYS.COMMENTS, comments)
}

export function getCommentById(id: string): Comment | undefined {
  const comments = getComments()
  return comments.find(comment => comment.id === id)
}

export function deleteComment(id: string): boolean {
  const comments = getComments()
  const initialLength = comments.length
  const filteredComments = comments.filter(comment => comment.id !== id)
  
  if (filteredComments.length === initialLength) {
    return false // Comment not found
  }
  
  saveToStorage(STORAGE_KEYS.COMMENTS, filteredComments)
  return true
}

export function getCommentsByPost(postId: string): Comment[] {
  const comments = getComments()
  return comments
    .filter(comment => comment.postId === postId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getCommentsByStatus(status: Comment['status']): Comment[] {
  const comments = getComments()
  return comments
    .filter(comment => comment.status === status)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function addComment(input: { author: string; email: string; content: string; postId: string; postTitle: string; postSlug: string }): Comment {
  const comment: Comment = {
    id: generateId(),
    author: input.author,
    email: input.email,
    content: input.content,
    postId: input.postId,
    postTitle: input.postTitle,
    postSlug: input.postSlug,
    status: (getSettings()?.content.moderateComments ?? true) ? 'pending' : 'approved',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  saveComment(comment)
  return comment
}

export function addReply(parentId: string, input: { author: string; email: string; content: string }): Comment | null {
  const comments = getComments()
  const parent = comments.find(comment => comment.id === parentId)

  if (!parent) {
    return null
  }

  const reply: Comment = {
    id: generateId(),
    author: input.author,
    email: input.email,
    content: input.content,
    postId: parent.postId,
    postTitle: parent.postTitle,
    postSlug: parent.postSlug,
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  parent.replies = [...(parent.replies ?? []), reply]
  saveComment(parent)
  return reply
}

// Settings storage utilities
export function getSettings(): BlogSettings | null {
  const settings = getFromStorage<BlogSettings>(STORAGE_KEYS.SETTINGS)
  return settings.length > 0 ? settings[0] : null
}

export function saveSettings(settings: BlogSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, [settings])
}

export function getDefaultSettings(): BlogSettings {
  return getDefaultBlogSettings()
}

// Subscriber storage utilities
export function addSubscriber(email: string): void {
  const subscribers = getFromStorage<string>(STORAGE_KEYS.SUBSCRIBERS)
  if (!subscribers.includes(email)) {
    subscribers.push(email)
    saveToStorage(STORAGE_KEYS.SUBSCRIBERS, subscribers)
  }
}
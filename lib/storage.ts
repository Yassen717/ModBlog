import { Post, Author, Category, User, Comment, BlogSettings } from '@/types/blog'

const STORAGE_KEYS = {
  POSTS: 'blog_posts',
  AUTHORS: 'blog_authors',
  CATEGORIES: 'blog_categories',
  USERS: 'blog_users',
  COMMENTS: 'blog_comments',
  SETTINGS: 'blog_settings',
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

// Settings storage utilities
export function getSettings(): BlogSettings | null {
  const settings = getFromStorage<BlogSettings>(STORAGE_KEYS.SETTINGS)
  return settings.length > 0 ? settings[0] : null
}

export function saveSettings(settings: BlogSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, [settings])
}

export function getDefaultSettings(): BlogSettings {
  return {
    general: {
      siteName: 'Modern Blog',
      siteDescription: 'A modern, beautiful blog built with Next.js and TypeScript',
      siteUrl: 'https://modernblog.com',
      timezone: 'America/New_York',
      language: 'en',
    },
    appearance: {
      theme: 'system',
      primaryColor: '#3B82F6',
      fontFamily: 'Inter',
      logoUrl: '',
      faviconUrl: '',
    },
    content: {
      postsPerPage: 10,
      enableComments: true,
      moderateComments: true,
      allowGuestComments: false,
      showAuthorBio: true,
      showReadingTime: true,
      enableSocialSharing: true,
    },
    seo: {
      metaTitle: 'Modern Blog - Latest in Web Development',
      metaDescription: 'Stay updated with the latest trends in web development, JavaScript, React, and more.',
      ogImage: '',
      twitterHandle: '@modernblog',
      enableSitemap: true,
      enableRobotsTxt: true,
    },
    analytics: {
      googleAnalyticsId: '',
      googleSearchConsole: '',
      enableCookieConsent: true,
      trackingScript: '',
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: 24,
      enableCaptcha: true,
      maxLoginAttempts: 5,
    },
    notifications: {
      emailNotifications: true,
      newCommentNotifications: true,
      weeklyReports: true,
      systemUpdates: true,
    },
  }
}
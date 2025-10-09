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

export interface User {
  id: string
  name: string
  email: string
  role: 'Administrator' | 'Editor' | 'Author' | 'Subscriber'
  avatar?: string
  status: 'active' | 'inactive'
  lastLogin?: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  author: string
  email: string
  content: string
  postId: string
  postTitle: string
  postSlug: string
  status: 'approved' | 'pending' | 'spam'
  createdAt: Date
  updatedAt: Date
  replies?: Comment[]
}

export interface BlogSettings {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    timezone: string
    language: string
  }
  appearance: {
    theme: 'light' | 'dark' | 'system'
    primaryColor: string
    fontFamily: string
    logoUrl: string
    faviconUrl: string
  }
  content: {
    postsPerPage: number
    enableComments: boolean
    moderateComments: boolean
    allowGuestComments: boolean
    showAuthorBio: boolean
    showReadingTime: boolean
    enableSocialSharing: boolean
  }
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage: string
    twitterHandle: string
    enableSitemap: boolean
    enableRobotsTxt: boolean
  }
  analytics: {
    googleAnalyticsId: string
    googleSearchConsole: string
    enableCookieConsent: boolean
    trackingScript: string
  }
  security: {
    enableTwoFactor: boolean
    sessionTimeout: number
    enableCaptcha: boolean
    maxLoginAttempts: number
  }
  notifications: {
    emailNotifications: boolean
    newCommentNotifications: boolean
    weeklyReports: boolean
    systemUpdates: boolean
  }
}
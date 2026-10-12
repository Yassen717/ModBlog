'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { initializeSampleData } from '@/lib/sample-data'
import { getAllPosts, getCategories, getAuthors, getUsers, getComments, getSettings, getFromStorage } from '@/lib/storage'

const STORAGE_KEYS = ['blog_posts', 'blog_authors', 'blog_categories', 'blog_users', 'blog_comments', 'blog_settings', 'blog_subscribers']

export default function DataResetPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [counts, setCounts] = useState({
    posts: 0,
    categories: 0,
    authors: 0,
    users: 0,
    comments: 0,
    settings: 0,
    subscribers: 0,
  })

  const refreshCounts = () => {
    setCounts({
      posts: getAllPosts().length,
      categories: getCategories().length,
      authors: getAuthors().length,
      users: getUsers().length,
      comments: getComments().length,
      settings: getSettings() ? 1 : 0,
      subscribers: getFromStorage<string>('blog_subscribers').length,
    })
  }

  useEffect(() => {
    refreshCounts()
  }, [])

  const handleClearData = () => {
    setLoading(true)
    setMessage('')

    try {
      // Clear all blog data from localStorage
      STORAGE_KEYS.forEach(key => localStorage.removeItem(key))
      refreshCounts()

      setMessage('✅ All data cleared successfully! Click "Reinitialize Data" to load fresh data.')
    } catch (error) {
      setMessage('❌ Error clearing data: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleReinitialize = () => {
    setLoading(true)
    setMessage('')

    try {
      // Reinitialize with fresh sample data
      initializeSampleData()
      refreshCounts()

      setMessage('✅ Data reinitialized with local images! Please refresh the page to see changes.')

      // Auto-reload after 2 seconds
      setTimeout(() => {
        window.location.href = '/admin'
      }, 2000)
    } catch (error) {
      setMessage('❌ Error reinitializing data: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleFullReset = () => {
    setLoading(true)
    setMessage('')

    try {
      // Clear all data
      STORAGE_KEYS.forEach(key => localStorage.removeItem(key))

      // Reinitialize
      initializeSampleData()
      refreshCounts()

      setMessage('✅ Full reset complete! Redirecting to admin...')

      // Auto-reload after 1 second
      setTimeout(() => {
        window.location.href = '/admin'
      }, 1000)
    } catch (error) {
      setMessage('❌ Error during reset: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const storageItems = [
    { name: 'Posts', value: counts.posts, color: 'text-blue-600 dark:text-blue-400' },
    { name: 'Categories', value: counts.categories, color: 'text-green-600 dark:text-green-400' },
    { name: 'Authors', value: counts.authors, color: 'text-purple-600 dark:text-purple-400' },
    { name: 'Users', value: counts.users, color: 'text-orange-600 dark:text-orange-400' },
    { name: 'Comments', value: counts.comments, color: 'text-pink-600 dark:text-pink-400' },
    { name: 'Settings', value: counts.settings, color: 'text-teal-600 dark:text-teal-400' },
    { name: 'Subscribers', value: counts.subscribers, color: 'text-indigo-600 dark:text-indigo-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Clear and reinitialize blog data</p>
      </div>

      {/* Warning Card */}
      <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
              Warning: Data Reset
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              These actions will clear all blog data from localStorage. This includes all posts,
              categories, users, comments, and settings. This action cannot be undone.
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🔄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reinitialize Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Load fresh sample data with local images. Keeps existing data if any.
            </p>
            <Button
              onClick={handleReinitialize}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Reinitialize'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🗑️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Clear All Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remove all blog data from localStorage. You&apos;ll need to reinitialize after.
            </p>
            <Button
              onClick={handleClearData}
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              {loading ? 'Processing...' : 'Clear Data'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🔥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Full Reset
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clear all data and reinitialize with fresh sample data in one step.
            </p>
            <Button
              onClick={handleFullReset}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Processing...' : 'Full Reset'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Message Display */}
      {message && (
        <Card className="p-6">
          <p className="text-center text-lg">{message}</p>
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          When to Use This Tool
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span><strong>After updating image paths:</strong> Use &quot;Full Reset&quot; to migrate from external URLs to local images</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span><strong>Testing with fresh data:</strong> Use &quot;Full Reset&quot; to get clean sample data</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span><strong>Corrupted data:</strong> Use &quot;Full Reset&quot; if you&apos;re experiencing errors</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span><strong>Starting over:</strong> Use &quot;Clear All Data&quot; then manually add your own content</span>
          </li>
        </ul>
      </Card>

      {/* Current Data Info */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Current Storage Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {storageItems.map((item) => (
            <div key={item.name} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{item.name}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { initializeSampleData } from '@/lib/sample-data'

export default function DataResetPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClearData = () => {
    setLoading(true)
    setMessage('')
    
    try {
      // Clear all blog data from localStorage
      localStorage.removeItem('blog_posts')
      localStorage.removeItem('blog_authors')
      localStorage.removeItem('blog_categories')
      localStorage.removeItem('blog_users')
      localStorage.removeItem('blog_comments')
      localStorage.removeItem('blog_settings')
      
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
      localStorage.removeItem('blog_posts')
      localStorage.removeItem('blog_authors')
      localStorage.removeItem('blog_categories')
      localStorage.removeItem('blog_users')
      localStorage.removeItem('blog_comments')
      localStorage.removeItem('blog_settings')
      
      // Reinitialize
      initializeSampleData()
      
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
              Remove all blog data from localStorage. You'll need to reinitialize after.
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
            <span><strong>After updating image paths:</strong> Use "Full Reset" to migrate from external URLs to local images</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span><strong>Testing with fresh data:</strong> Use "Full Reset" to get clean sample data</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span><strong>Corrupted data:</strong> Use "Full Reset" if you're experiencing errors</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span><strong>Starting over:</strong> Use "Clear All Data" then manually add your own content</span>
          </li>
        </ul>
      </Card>

      {/* Current Data Info */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Current Storage Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {typeof window !== 'undefined' && localStorage.getItem('blog_posts') 
                ? JSON.parse(localStorage.getItem('blog_posts') || '[]').length 
                : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {typeof window !== 'undefined' && localStorage.getItem('blog_categories') 
                ? JSON.parse(localStorage.getItem('blog_categories') || '[]').length 
                : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {typeof window !== 'undefined' && localStorage.getItem('blog_authors') 
                ? JSON.parse(localStorage.getItem('blog_authors') || '[]').length 
                : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Authors</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

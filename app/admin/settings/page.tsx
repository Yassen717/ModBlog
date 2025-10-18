'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BlogSettings } from '@/types/blog'
import { getSettings, saveSettings, getDefaultSettings } from '@/lib/storage'

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<BlogSettings>(getDefaultSettings())
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    loadSettings()
  }, [])
  
  // Refresh settings when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadSettings()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const loadSettings = () => {
    try {
      setLoading(true)
      const existingSettings = getSettings()
      
      if (existingSettings) {
        setSettings(existingSettings)
        console.log('Loaded settings from localStorage')
      } else {
        // Use default settings if none exist
        const defaultSettings = getDefaultSettings()
        setSettings(defaultSettings)
        // Save default settings to localStorage
        saveSettings(defaultSettings)
        console.log('Using default settings')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    // Removed appearance tab as requested
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      saveSettings(settings)
      console.log('Settings saved successfully:', settings)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (category: keyof BlogSettings, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your blog settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : '💾 Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Site Name
                    </label>
                    <Input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Site URL
                    </label>
                    <Input
                      type="url"
                      value={settings.general.siteUrl}
                      onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Description
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Content Settings */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Content Settings</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Posts Per Page
                  </label>
                  <Input
                    type="number"
                    value={settings.content.postsPerPage}
                    onChange={(e) => updateSetting('content', 'postsPerPage', parseInt(e.target.value))}
                    min="1"
                    max="50"
                    className="w-32"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Comments
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.content.enableComments}
                      onChange={(e) => updateSetting('content', 'enableComments', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Moderate Comments
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.content.moderateComments}
                      onChange={(e) => updateSetting('content', 'moderateComments', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allow Guest Comments
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.content.allowGuestComments}
                      onChange={(e) => updateSetting('content', 'allowGuestComments', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Author Bio
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.content.showAuthorBio}
                      onChange={(e) => updateSetting('content', 'showAuthorBio', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Reading Time
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.content.showReadingTime}
                      onChange={(e) => updateSetting('content', 'showReadingTime', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Social Sharing
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.content.enableSocialSharing}
                      onChange={(e) => updateSetting('content', 'enableSocialSharing', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would be similar... */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">SEO Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meta Title
                    </label>
                    <Input
                      type="text"
                      value={settings.seo.metaTitle}
                      onChange={(e) => updateSetting('seo', 'metaTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={settings.seo.metaDescription}
                      onChange={(e) => updateSetting('seo', 'metaDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter Handle
                    </label>
                    <Input
                      type="text"
                      value={settings.seo.twitterHandle}
                      onChange={(e) => updateSetting('seo', 'twitterHandle', e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {!['general', 'content', 'seo'].includes(activeTab) && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {tabs.find(t => t.id === activeTab)?.name} Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This section is coming soon. Configure your {activeTab} preferences here.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
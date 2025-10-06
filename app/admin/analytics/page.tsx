'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Mock analytics data
const analyticsData = {
  overview: {
    totalViews: 45672,
    totalPosts: 24,
    totalComments: 189,
    avgReadTime: '4.2 min',
    bounceRate: '34.2%',
    returnVisitors: '68.5%',
  },
  topPosts: [
    { title: 'Building Responsive Layouts with CSS Grid', views: 3420, engagement: '8.2%' },
    { title: 'React Server Components Guide', views: 2890, engagement: '7.1%' },
    { title: 'Getting Started with Next.js 14', views: 2156, engagement: '6.8%' },
    { title: 'TypeScript Advanced Types', views: 1834, engagement: '5.9%' },
    { title: 'Modern JavaScript ES2024', views: 1623, engagement: '5.2%' },
  ],
  traffic: {
    thisWeek: [120, 132, 101, 134, 90, 230, 210],
    lastWeek: [110, 125, 95, 128, 85, 220, 200],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  sources: [
    { name: 'Direct', visits: 15234, percentage: 45.2 },
    { name: 'Google Search', visits: 12456, percentage: 37.1 },
    { name: 'Social Media', visits: 3890, percentage: 11.6 },
    { name: 'Email', visits: 1567, percentage: 4.7 },
    { name: 'Referrals', visits: 453, percentage: 1.4 },
  ],
  demographics: {
    countries: [
      { name: 'United States', visitors: 12456, flag: '🇺🇸' },
      { name: 'United Kingdom', visitors: 8934, flag: '🇬🇧' },
      { name: 'Germany', visitors: 6789, flag: '🇩🇪' },
      { name: 'Canada', visitors: 4567, flag: '🇨🇦' },
      { name: 'Australia', visitors: 3234, flag: '🇦🇺' },
    ],
    devices: [
      { name: 'Desktop', percentage: 52.1, icon: '💻' },
      { name: 'Mobile', percentage: 38.9, icon: '📱' },
      { name: 'Tablet', percentage: 9.0, icon: '📊' },
    ],
  },
}

export default function AnalyticsAdmin() {
  const [dateRange, setDateRange] = useState('7d')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your blog&apos;s performance and engagement</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="secondary">
            📊 Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(analyticsData.overview).map(([key, value]) => (
          <Card key={key} className="p-4 text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📈 Weekly Traffic
          </h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.traffic.thisWeek.map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t flex flex-col justify-end" style={{ height: '200px' }}>
                  <div 
                    className="bg-blue-500 rounded-t transition-all duration-300"
                    style={{ height: `${(value / Math.max(...analyticsData.traffic.thisWeek)) * 180}px` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {analyticsData.traffic.labels[index]}
                </div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🌐 Traffic Sources
          </h2>
          <div className="space-y-4">
            {analyticsData.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {source.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {source.visits.toLocaleString()} visits
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Posts */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🔥 Top Performing Posts
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Post Title</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Views</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topPosts.map((post, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mr-2">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">{post.title}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 text-sm text-gray-900 dark:text-white">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="text-right py-3">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {post.engagement}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🌍 Top Countries
          </h2>
          <div className="space-y-3">
            {analyticsData.demographics.countries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {country.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {country.visitors.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Devices */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📱 Device Types
          </h2>
          <div className="space-y-4">
            {analyticsData.demographics.devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{device.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          ⚡ Real-time Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              23
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Users Online</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              5
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              12
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Page Views (Last Hour)</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
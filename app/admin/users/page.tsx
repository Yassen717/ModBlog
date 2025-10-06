'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face&auto=format&q=80',
    status: 'active',
    lastLogin: '2024-01-15 14:30',
    posts: 24,
    comments: 89,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b626e9d5?w=50&h=50&fit=crop&crop=face&auto=format&q=80',
    status: 'active',
    lastLogin: '2024-01-14 09:15',
    posts: 8,
    comments: 45,
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'Author',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face&auto=format&q=80',
    status: 'inactive',
    lastLogin: '2024-01-10 16:45',
    posts: 3,
    comments: 12,
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Subscriber',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face&auto=format&q=80',
    status: 'active',
    lastLogin: '2024-01-13 11:20',
    posts: 0,
    comments: 23,
  },
]

const roleColors = {
  Administrator: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  Editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Author: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Subscriber: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export default function UsersAdmin() {
  const [users, setUsers] = useState(mockUsers)
  const [isInviting, setIsInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Subscriber')

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending invitation
    alert(`Invitation sent to ${inviteEmail} as ${inviteRole}`)
    setInviteEmail('')
    setIsInviting(false)
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => setIsInviting(true)} disabled={isInviting}>
          👥 Invite User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {users.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {users.filter(u => u.role === 'Administrator' || u.role === 'Editor').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Staff Members</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {users.reduce((sum, user) => sum + user.posts, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
        </Card>
      </div>

      {/* Invite Form */}
      {isInviting && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Invite New User
          </h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Subscriber">Subscriber</option>
                  <option value="Author">Author</option>
                  <option value="Editor">Editor</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button type="submit">
                Send Invitation
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsInviting(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${roleColors[user.role as keyof typeof roleColors]}`}
                    >
                      <option value="Subscriber">Subscriber</option>
                      <option value="Author">Author</option>
                      <option value="Editor">Editor</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      📝 {user.posts} posts
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      💬 {user.comments} comments
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        📧
                      </Button>
                      <Button variant="ghost" size="sm">
                        📝
                      </Button>
                      <div className="relative group">
                        <Button variant="ghost" size="sm">
                          ⋮
                        </Button>
                        <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <div className="py-1">
                            <button
                              onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => {/* Reset password logic */}}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="block px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            >
                              Delete User
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Permissions Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Role Permissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Administrator</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Full system access</li>
              <li>• Manage all users</li>
              <li>• System settings</li>
              <li>• All content management</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Editor</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Edit all posts</li>
              <li>• Manage categories</li>
              <li>• Moderate comments</li>
              <li>• Publish content</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Author</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Create/edit own posts</li>
              <li>• Upload media</li>
              <li>• Publish own content</li>
              <li>• View analytics</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Subscriber</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Read content</li>
              <li>• Leave comments</li>
              <li>• Update profile</li>
              <li>• Subscribe to newsletter</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
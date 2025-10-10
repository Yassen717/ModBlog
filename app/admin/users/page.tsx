'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { User } from '@/types/blog'
import { getUsers, saveUser, deleteUser, getAllPosts } from '@/lib/storage'

// Extended user type with post/comment counts for admin display
type UserWithCounts = User & { posts: number; comments: number }

const roleColors = {
  Administrator: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  Editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Author: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Subscriber: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserWithCounts[]>([])
  const [isInviting, setIsInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<User['role']>('Subscriber')
  const [loading, setLoading] = useState(true)

  // Load users from localStorage on mount
  useEffect(() => {
    loadUsers()
  }, [])
  
  // Refresh users when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUsers()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const loadUsers = () => {
    try {
      setLoading(true)
      const allUsers = getUsers()
      const allPosts = getAllPosts()
      
      // Add post counts to users (comments would need to be implemented)
      const usersWithCounts: UserWithCounts[] = allUsers.map(user => ({
        ...user,
        posts: allPosts.filter(post => post.author.id === user.id).length,
        comments: 0, // TODO: implement comments count when comments are integrated
      }))
      
      setUsers(usersWithCounts)
      console.log('Loaded users from localStorage:', usersWithCounts.length)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: inviteEmail.split('@')[0], // Use email prefix as name initially
      email: inviteEmail,
      role: inviteRole,
      status: 'active',
      lastLogin: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    try {
      // Save to localStorage
      saveUser(newUser)
      
      // Update local state
      const newUserWithCounts: UserWithCounts = {
        ...newUser,
        posts: 0,
        comments: 0,
      }
      setUsers([...users, newUserWithCounts])
      
      setInviteEmail('')
      setIsInviting(false)
      console.log('User invited successfully:', newUser)
    } catch (error) {
      console.error('Error inviting user:', error)
      alert('Error inviting user')
    }
  }

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      const userToUpdate = users.find(user => user.id === userId)
      if (!userToUpdate) return
      
      const updatedUser: User = {
        ...userToUpdate,
        status: newStatus,
        updatedAt: new Date(),
      }
      
      // Save to localStorage
      saveUser(updatedUser)
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      ))
      
      console.log('User status updated:', updatedUser)
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Error updating user status')
    }
  }

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    try {
      const userToUpdate = users.find(user => user.id === userId)
      if (!userToUpdate) return
      
      const updatedUser: User = {
        ...userToUpdate,
        role: newRole,
        updatedAt: new Date(),
      }
      
      // Save to localStorage
      saveUser(updatedUser)
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ))
      
      console.log('User role updated:', updatedUser)
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Error updating user role')
    }
  }

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // Delete from localStorage
        const success = deleteUser(userId)
        
        if (success) {
          // Update local state
          setUsers(users.filter(user => user.id !== userId))
          console.log('User deleted successfully:', userId)
        } else {
          alert('Failed to delete user - user not found')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user')
      }
    }
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
                  onChange={(e) => setInviteRole(e.target.value as User['role'])}
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
                        src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face&auto=format&q=80'}
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
                      onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
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
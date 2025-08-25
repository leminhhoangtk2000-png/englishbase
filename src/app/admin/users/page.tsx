'use client'

import { useState, useEffect } from 'react'
import { RoleBadge, UserRoleSelect } from '@/components/ui/role-badge'
import type { UserRole } from '@/lib/permissions'

interface User {
    id: string
    email: string
    username?: string
    name?: string
    role: UserRole
    isPremium: boolean
    createdAt: string
    _count: {
        posts: number
        exercises: number
        vocabulary: number
    }
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<string>('ALL')

    useEffect(() => {
        fetchUsers()
    }, [selectedRole])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (selectedRole !== 'ALL') {
                params.append('role', selectedRole)
            }

            const response = await fetch(`/api/users?${params}`)
            const data = await response.json()

            if (response.ok) {
                setUsers(data.data)
            } else {
                setError(data.error || 'Failed to fetch users')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    const updateUserRole = async (userId: string, newRole: UserRole) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            })

            if (response.ok) {
                fetchUsers() // Refresh the list
            } else {
                const data = await response.json()
                setError(data.error || 'Failed to update user role')
            }
        } catch (err) {
            setError('Network error')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">❌ Error</div>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>

            {/* Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Filter by Role:</label>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="USER_PREMIUM">Premium User</option>
                    <option value="USER">Regular User</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <li key={user.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            {user.name?.charAt(0) || user.email.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.name || 'No name'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user.email}
                                        </div>
                                        {user.username && (
                                            <div className="text-sm text-gray-500">
                                                @{user.username}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Stats */}
                                    <div className="text-sm text-gray-500">
                                        <div>Posts: {user._count.posts}</div>
                                        <div>Exercises: {user._count.exercises}</div>
                                        <div>Vocabulary: {user._count.vocabulary}</div>
                                    </div>

                                    {/* Role Badge */}
                                    <RoleBadge role={user.role} />

                                    {/* Premium Status */}
                                    {user.isPremium && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Premium
                                        </span>
                                    )}

                                    {/* Role Selector */}
                                    <UserRoleSelect
                                        value={user.role}
                                        onChange={(newRole) => updateUserRole(user.id, newRole)}
                                        className="w-40"
                                    />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {users.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No users found.</p>
                </div>
            )}
        </div>
    )
}

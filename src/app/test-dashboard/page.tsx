'use client'

import { useState, useEffect } from 'react'
import { RoleBadge } from '@/components/ui/role-badge'
import Link from 'next/link'

interface TestOverview {
    stats: {
        totalUsers: number
        adminUsers: number
        premiumUsers: number
        regularUsers: number
        vocabularyEntries: number
        exercises: number
        posts: number
        payments: number
    }
    users: Array<{
        id: string
        email: string
        username?: string
        name?: string
        role: 'ADMIN' | 'USER_PREMIUM' | 'USER'
        isPremium: boolean
        createdAt: string
        _count: {
            posts: number
            exercises: number
            vocabulary: number
            progress: number
        }
    }>
    testInstructions: {
        description: string
        accounts: Array<{
            role: string
            email: string
            username: string
            permissions: string
        }>
        testEndpoints: string[]
    }
}

export default function TestDashboard() {
    const [data, setData] = useState<TestOverview | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchTestOverview()
    }, [])

    const fetchTestOverview = async () => {
        try {
            const response = await fetch('/api/test-overview')
            const result = await response.json()

            if (response.ok) {
                setData(result)
            } else {
                setError(result.error || 'Failed to fetch test overview')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading test dashboard...</p>
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
                        onClick={fetchTestOverview}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">🧪 Test Dashboard</h1>

            {/* Database Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">{data.stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Vocabulary</h3>
                    <p className="text-3xl font-bold text-green-600">{data.stats.vocabularyEntries}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Exercises</h3>
                    <p className="text-3xl font-bold text-purple-600">{data.stats.exercises}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Posts</h3>
                    <p className="text-3xl font-bold text-orange-600">{data.stats.posts}</p>
                </div>
            </div>

            {/* User Role Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-red-50 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Admin Users</h3>
                    <p className="text-2xl font-bold text-red-600">{data.stats.adminUsers}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Premium Users</h3>
                    <p className="text-2xl font-bold text-purple-600">{data.stats.premiumUsers}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Regular Users</h3>
                    <p className="text-2xl font-bold text-blue-600">{data.stats.regularUsers}</p>
                </div>
            </div>

            {/* Test Accounts */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">🔑 Test Accounts</h2>
                <p className="text-gray-600 mb-4">{data.testInstructions.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.testInstructions.accounts.map((account, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">{account.username}</h3>
                                <RoleBadge role={account.role as any} />
                            </div>
                            <p className="text-sm text-gray-600 mb-1">📧 {account.email}</p>
                            <p className="text-sm text-gray-500">{account.permissions}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Users */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">👥 Current Users</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stats
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name || 'No name'}
                                            </div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                            {user.username && (
                                                <div className="text-sm text-gray-500">@{user.username}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <RoleBadge role={user.role} />
                                        {user.isPremium && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Premium
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>Posts: {user._count.posts}</div>
                                        <div>Exercises: {user._count.exercises}</div>
                                        <div>Vocabulary: {user._count.vocabulary}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a
                                            href={`/api/permissions?userId=${user.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Check Permissions
                                        </a>
                                        <a
                                            href={`/api/users/${user.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            View Details
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Test Endpoints */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">🔗 Test Endpoints</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {data.testInstructions.testEndpoints.map((endpoint, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                                {endpoint}
                            </code>
                            {endpoint.includes('GET /api/') && (
                                <a
                                    href={endpoint.split(' ')[1]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Test
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">⚡ Quick Actions</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/users"
                        className="block bg-blue-500 text-white text-center py-3 px-4 rounded hover:bg-blue-600"
                    >
                        👥 Manage Users
                    </Link>
                    <Link
                        href="/vocabulary"
                        className="block bg-green-500 text-white text-center py-3 px-4 rounded hover:bg-green-600"
                    >
                        📚 View Vocabulary
                    </Link>
                    <a
                        href="http://localhost:5050"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-purple-500 text-white text-center py-3 px-4 rounded hover:bg-purple-600"
                    >
                        🗄️ pgAdmin
                    </a>
                </div>
            </div>
        </div>
    )
}

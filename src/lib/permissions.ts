export type UserRole = 'ADMIN' | 'USER' | 'USER_PREMIUM'

export interface User {
    id: string
    email: string
    name?: string
    role: UserRole
    isPremium: boolean
}

export const rolePermissions = {
    ADMIN: {
        canManageUsers: true,
        canManageContent: true,
        canAccessPremiumFeatures: true,
        canViewAnalytics: true,
        canModerateComments: true,
        canCreateExercises: true,
        canManageVocabulary: true
    },
    USER_PREMIUM: {
        canManageUsers: false,
        canManageContent: false,
        canAccessPremiumFeatures: true,
        canViewAnalytics: false,
        canModerateComments: false,
        canCreateExercises: false,
        canManageVocabulary: false
    },
    USER: {
        canManageUsers: false,
        canManageContent: false,
        canAccessPremiumFeatures: false,
        canViewAnalytics: false,
        canModerateComments: false,
        canCreateExercises: false,
        canManageVocabulary: false
    }
}

export function hasPermission(user: User, permission: keyof typeof rolePermissions.ADMIN): boolean {
    return rolePermissions[user.role][permission] || false
}

export function canAccessPremiumContent(user: User): boolean {
    return user.role === 'ADMIN' || user.role === 'USER_PREMIUM' || user.isPremium
}

export function isAdmin(user: User): boolean {
    return user.role === 'ADMIN'
}

export function isPremiumUser(user: User): boolean {
    return user.role === 'USER_PREMIUM' || user.isPremium
}

export function getRoleDisplayName(role: UserRole): string {
    switch (role) {
        case 'ADMIN':
            return 'Quản trị viên'
        case 'USER_PREMIUM':
            return 'Người dùng Premium'
        case 'USER':
            return 'Người dùng'
        default:
            return 'Không xác định'
    }
}

export function getRoleBadgeColor(role: UserRole): string {
    switch (role) {
        case 'ADMIN':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        case 'USER_PREMIUM':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
        case 'USER':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
}

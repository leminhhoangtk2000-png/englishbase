import { cn } from "@/lib/utils"
import { UserRole, getRoleDisplayName, getRoleBadgeColor } from "@/lib/permissions"

interface RoleBadgeProps {
    role: UserRole
    className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                getRoleBadgeColor(role),
                className
            )}
        >
            {getRoleDisplayName(role)}
        </span>
    )
}

interface UserRoleSelectProps {
    value: UserRole
    onChange: (role: UserRole) => void
    disabled?: boolean
    className?: string
}

export function UserRoleSelect({ value, onChange, disabled, className }: UserRoleSelectProps) {
    const roles: UserRole[] = ['USER', 'USER_PREMIUM', 'ADMIN']

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as UserRole)}
            disabled={disabled}
            className={cn(
                "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {roles.map((role) => (
                <option key={role} value={role}>
                    {getRoleDisplayName(role)}
                </option>
            ))}
        </select>
    )
}

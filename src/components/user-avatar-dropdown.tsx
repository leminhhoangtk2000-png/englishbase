'use client'

import React from 'react'
import { useAuth } from '@/lib/auth-context'
import { getDashboardPath } from '@/lib/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Crown,
  LayoutDashboard
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserAvatarDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleDashboard = () => {
    const dashboardPath = getDashboardPath(user.role)
    router.push(dashboardPath)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      case 'USER_PREMIUM':
        return <Crown className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = () => {
    switch (user.role) {
      case 'ADMIN':
        return 'text-red-600'
      case 'USER_PREMIUM':
        return 'text-yellow-600'
      default:
        return 'text-blue-600'
    }
  }

  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user.email[0].toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || undefined} alt={user.name || user.email} />
            <AvatarFallback className="text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {user.name || user.username || 'User'}
              </p>
              <div className={`flex items-center gap-1 ${getRoleColor()}`}>
                {getRoleIcon()}
                <span className="text-xs font-medium">
                  {user.role === 'USER_PREMIUM' ? 'PREMIUM' : user.role}
                </span>
              </div>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.isPremium && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Crown className="h-3 w-3" />
                <span className="text-xs">Premium Account</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

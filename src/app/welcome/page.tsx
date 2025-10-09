'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainNav } from '@/components/main-nav'
import { CheckCircle2, BookOpen, Heart, Target } from 'lucide-react'

export default function WelcomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewUser = searchParams.get('new_user') === 'true'
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/login')
      return
    }

    // Show animation for new users
    if (isNewUser) {
      setTimeout(() => setShowAnimation(true), 500)
    }
  }, [user, loading, router, isNewUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <MainNav />
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4">
        <Card className={`max-w-2xl w-full transform transition-all duration-1000 ${
          showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
        }`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">
              🎉 Chào mừng bạn đến với Edu Theme!
            </CardTitle>
            <CardDescription className="text-lg">
              {isNewUser ? 'Tài khoản của bạn đã được tạo thành công!' : 'Chào mừng trở lại!'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User info */}
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-center">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                Xin chào,
              </div>
              <div className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                {user.name || user.email}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                {user.email}
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold mb-1">Học tập hiệu quả</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tiến độ được lưu tự động
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="font-semibold mb-1">Đánh giá bài tập</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Like những bài tập yêu thích
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold mb-1">Theo dõi kết quả</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Xem thống kê học tập
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                size="lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Bắt đầu học ngay
              </Button>
              
              <Button 
                onClick={() => router.push('/profile')}
                variant="outline"
                className="w-full text-lg py-6"
                size="lg"
              >
                Cập nhật hồ sơ
              </Button>
            </div>

            {isNewUser && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                💡 Mẹo: Bạn có thể cập nhật thông tin cá nhân trong phần hồ sơ để có trải nghiệm tốt hơn.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

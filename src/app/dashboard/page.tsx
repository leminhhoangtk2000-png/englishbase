'use client';

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MainNav } from "@/components/main-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Trophy, Clock, User, Settings, Heart } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('Dashboard - Auth state:', { user, loading });

  useEffect(() => {
    if (!loading && !user) {
      console.log('Dashboard - Redirecting to login because no user');
      router.push('/login?returnUrl=/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Quản trị viên', color: 'bg-red-100 text-red-800' };
      case 'USER_PREMIUM':
        return { label: 'Người dùng Premium', color: 'bg-yellow-100 text-yellow-800' };
      case 'USER':
        return { label: 'Người dùng', color: 'bg-blue-100 text-blue-800' };
      default:
        return { label: 'Người dùng', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const roleDisplay = getRoleDisplay(user.role);

  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Chào mừng, {user.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Đây là bảng điều khiển cá nhân của bạn - nơi theo dõi tiến trình học tập tiếng Đức.
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thông tin tài khoản</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vai trò:</span>
                  <Badge className={roleDisplay.color}>{roleDisplay.label}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiến trình học tập</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Bài tập đã hoàn thành
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thời gian học</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">0h</div>
                <p className="text-xs text-muted-foreground">
                  Tổng thời gian học
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/a1niveau">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium">A1 Niveau</h3>
                <p className="text-sm text-gray-600">Bắt đầu học cơ bản</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/a2niveau">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium">A2 Niveau</h3>
                <p className="text-sm text-gray-600">Tiếp tục phát triển</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/exercises">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <h3 className="font-medium">Bài tập</h3>
                <p className="text-sm text-gray-600">Luyện tập kỹ năng</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/user/edit">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <h3 className="font-medium">Cài đặt</h3>
                <p className="text-sm text-gray-600">Chỉnh sửa hồ sơ</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Theo dõi tiến trình học tập của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có hoạt động nào. Hãy bắt đầu học tập ngay hôm nay!</p>
              <Button asChild className="mt-4">
                <Link href="/a1niveau">Bắt đầu học</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

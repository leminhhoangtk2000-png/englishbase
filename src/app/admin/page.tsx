import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Users, CreditCard, Activity, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getAdminStats() {
  const [
    totalUsers,
    premiumUsers,
    newUsersThisMonth,
    allUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isPremium: true } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isPremium: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    totalUsers,
    premiumUsers,
    newUsersThisMonth,
    allUsers
  };
}

function getRoleDisplay(role: string) {
  switch (role) {
    case 'ADMIN':
      return { label: 'Admin', variant: 'default' as const };
    case 'USER_PREMIUM':
      return { label: 'Premium', variant: 'secondary' as const };
    case 'USER':
      return { label: 'User', variant: 'outline' as const };
    default:
      return { label: 'Unknown', variant: 'outline' as const };
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold tracking-tight">Người dùng</h1>
              <p className="mt-1 text-muted-foreground">Quản lý tất cả người dùng trong hệ thống.</p>
          </div>
          <Button asChild>
              <Link href="/admin/users/new">Thêm người dùng mới</Link>
          </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Tổng người dùng trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tài khoản Premium
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premiumUsers}</div>
            <p className="text-xs text-muted-foreground">
              Số tài khoản Premium
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tài khoản mới</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Đăng ký tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Chưa theo dõi hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Tổng cộng có {stats.totalUsers} người dùng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
              <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                  type="search"
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                  />
              </div>
          </div>
          {stats.allUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có người dùng nào.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead className="hidden md:table-cell">Vai trò</TableHead>
                    <TableHead className="hidden md:table-cell">Ngày tham gia</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.allUsers.map((user) => {
                    const roleInfo = getRoleDisplay(user.role);
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                              <Avatar>
                                  <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
                                  <AvatarFallback>
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">
                                  <p>{user.name || 'Không có tên'}</p>
                                  <p className="text-sm text-muted-foreground md:hidden">{user.email}</p>
                              </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
                            {user.isPremium && <Badge variant="outline">Premium</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.createdAt.toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                              <DropdownMenuItem>Xóa</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

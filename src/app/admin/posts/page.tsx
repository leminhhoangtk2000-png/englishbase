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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";

async function getPendingPosts() {
  // Nếu có model Post trong database, uncomment dòng dưới
  // const posts = await prisma.post.findMany({
  //   where: { status: 'PENDING' },
  //   include: { author: true },
  //   orderBy: { createdAt: 'desc' }
  // });
  // return posts;
  
  // Hiện tại trả về array rỗng vì chưa có posts table
  return [];
}

export default async function AdminPostsPage() {
  const pendingPosts = await getPendingPosts();
  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-2xl font-bold tracking-tight">Bài viết chờ duyệt</h1>
          <p className="mt-1 text-muted-foreground">Xem lại và quyết định xuất bản các bài viết do người dùng đóng góp.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
          <CardDescription>
            Có tổng cộng {pendingPosts.length} bài viết đang chờ được duyệt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không có bài viết nào đang chờ duyệt.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Tiêu đề</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead className="hidden md:table-cell">Ngày gửi</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPosts.map((post: any) => (
                    <TableRow key={post.id || post.title}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                              <AvatarImage src={post.author?.avatar || ''} alt={post.author?.name || ''} />
                              <AvatarFallback>
                                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'U'}
                              </AvatarFallback>
                          </Avatar>
                          <span>{post.author?.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600">
                             <Check className="h-4 w-4" />
                             <span className="sr-only">Duyệt</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <X className="h-4 w-4" />
                              <span className="sr-only">Từ chối</span>
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

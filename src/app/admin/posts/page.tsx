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

const pendingPosts = [
    {
        title: "5 Mẹo Học Từ Vựng Tiếng Đức Hiệu Quả",
        author: "Siêu nhân hồng",
        avatar: "https://placehold.co/32x32.png",
        date: "2024-08-28",
    },
    {
        title: "Kinh Nghiệm Săn Học Bổng DAAD Từ A-Z",
        author: "Siêu nhân đỏ",
        avatar: "https://placehold.co/32x32.png",
        date: "2024-08-27",
    },
    {
        title: "Một Ngày Của Du Học Sinh Việt Tại Berlin",
        author: "Siêu nhân vàng",
        avatar: "https://placehold.co/32x32.png",
        date: "2024-08-25",
    },
];

export default function AdminPostsPage() {
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
                {pendingPosts.map((post) => (
                  <TableRow key={post.title}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={post.avatar} alt={post.author} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{post.author}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{post.date}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}

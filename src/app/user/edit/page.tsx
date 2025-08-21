"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EditProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hồ sơ công khai</CardTitle>
        <CardDescription>
          Thông tin này sẽ được hiển thị công khai.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src="https://placehold.co/80x80.png" />
            <AvatarFallback>KV</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button size="sm">Thay đổi ảnh đại diện</Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              Xóa
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên</Label>
          <Input id="name" defaultValue="Khoa Võ" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Giới thiệu</Label>
          <Textarea
            id="bio"
            placeholder="Hãy giới thiệu đôi chút về bạn..."
            defaultValue="Lập trình viên phát triển các dự án mã nguồn mở."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input id="url" placeholder="https://example.com" defaultValue="https://portfolio.example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input id="facebook" placeholder="facebook.com/username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" placeholder="instagram.com/username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tiktok">TikTok</Label>
          <Input id="tiktok" placeholder="@username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="threads">Threads</Label>
          <Input id="threads" placeholder="@username" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Lưu thay đổi</Button>
      </CardFooter>
    </Card>
  );
}

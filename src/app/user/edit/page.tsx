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
          <Label htmlFor="twitter">Twitter</Label>
          <Input id="twitter" placeholder="@username" defaultValue="@khoavo_dev" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" placeholder="linkedin.com/in/username" defaultValue="linkedin.com/in/khoavo" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Lưu thay đổi</Button>
      </CardFooter>
    </Card>
  );
}

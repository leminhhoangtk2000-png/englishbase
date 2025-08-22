"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"

export default function SignupPage() {
  return (
    <>
    <MainNav />
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl">Đăng ký</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để tạo một tài khoản mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">Tên đầy đủ</Label>
                <Input id="full-name" placeholder="Khoa Võ" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Tạo tài khoản
            </Button>
            <Button variant="outline" className="w-full">
              Đăng ký với Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Đã có tài khoản?{" "}
            <Link href="/login" className="underline">
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

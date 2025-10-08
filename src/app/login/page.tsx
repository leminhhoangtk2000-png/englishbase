"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getDashboardPath } from "@/lib/auth"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Loader2, AlertCircle } from "lucide-react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')

  // Validate return URL to prevent open redirect attacks
  const isValidReturnUrl = (url: string | null): boolean => {
    if (!url) return false
    try {
      // Must start with / and not contain protocol or domain
      return url.startsWith('/') && !url.startsWith('//') && !url.includes('://')
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(email, password)
      
      if (result.success) {
        // Redirect to return URL if provided and valid, otherwise to dashboard
        if (isValidReturnUrl(returnUrl)) {
          router.push(returnUrl!)
        } else {
          // Get user info and redirect to appropriate dashboard
          const response = await fetch('/api/auth/me', {
            credentials: 'include', // Important for cookies
          })
          if (response.ok) {
            const { user } = await response.json()
            const dashboardPath = getDashboardPath(user.role)
            router.push(dashboardPath)
          } else {
            router.push('/')
          }
        }
      } else {
        setError(result.error || "Đăng nhập thất bại")
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng nhập")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <MainNav />
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Đăng nhập</CardTitle>
            <CardDescription>
              Nhập email của bạn dưới đây để đăng nhập vào tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng nhập
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              Chưa có tài khoản?{" "}
              <Link href="/signup" className="underline">
                Đăng ký
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

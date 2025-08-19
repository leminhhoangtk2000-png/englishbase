import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Layers } from 'lucide-react';
import { MainNav } from '@/components/main-nav';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            Học Tiếng Đức Dễ Dàng.
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Deutsch.vn cung cấp một cách tiếp cận có tổ chức, nhanh chóng để học tiếng Đức. Xây dựng với Next.js cho trải nghiệm người dùng đẳng cấp thế giới.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/docs/introduction">
                <BookOpen className="mr-2 h-5 w-5" />
                Bắt đầu học
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com" target="_blank">
                Xem trên GitHub
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold">Tính Năng</h2>
              <p className="text-muted-foreground mt-2">Mọi thứ bạn cần cho một trang web học tập tuyệt vời.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-md">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
                    <Layers className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">Nội dung Linh hoạt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Viết tài liệu bằng JSX để có nội dung phong phú, tương tác với các thành phần.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-md">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">Cấu trúc Tổ chức</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Một hệ thống phân cấp tổ chức các tài liệu của bạn, giúp người dùng dễ dàng tìm thấy những gì họ cần.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-md">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
                    <Search className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">Tìm kiếm Toàn văn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Thanh tìm kiếm mạnh mẽ cho phép người dùng nhanh chóng xác định vị trí thông tin trên tất cả các tài liệu.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deutsch.vn. All rights reserved.</p>
      </footer>
    </div>
  );
}

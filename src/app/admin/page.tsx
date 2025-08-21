import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight">Trang quản trị</h1>
            <p className="mt-2 text-lg text-muted-foreground">Chào mừng đến với khu vực quản trị viên.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Tổng quan</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Đây là trang tổng quan dành cho quản trị viên. Các tính năng quản lý sẽ được phát triển ở đây.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

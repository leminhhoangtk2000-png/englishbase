"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, HelpCircle, BarChart } from "lucide-react";

export default function KiemTraPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">
          Bài Kiểm Tra Trình Độ
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Hãy cùng kiểm tra kiến thức tiếng Đức của bạn để xác định trình độ hiện tại và đặt ra mục tiêu học tập phù hợp.
        </p>
      </div>

      <Card className="mt-12 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Bài kiểm tra trắc nghiệm tổng hợp</CardTitle>
          <CardDescription>Bài thi bao gồm 60 câu hỏi và sẽ kéo dài trong 45 phút.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-semibold">Thời gian</p>
                        <p className="text-muted-foreground">45 phút</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-semibold">Số câu hỏi</p>
                        <p className="text-muted-foreground">60 câu</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <BarChart className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-semibold">Trình độ</p>
                        <p className="text-muted-foreground">A1 - B2</p>
                    </div>
                </div>
            </div>
          <p className="text-muted-foreground mt-6">
            Bài kiểm tra này sẽ giúp bạn đánh giá khả năng của mình qua các cấp độ từ A1 đến B2. Kết quả sẽ giúp bạn xác định được lộ trình học tập hiệu quả nhất.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full md:w-auto">Bắt đầu làm bài</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

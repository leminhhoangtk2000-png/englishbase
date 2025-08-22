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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function BlogRulesPage() {
  const [rules, setRules] = React.useState(
    "- Không được seeding trong bài viết.\n- Không mang tính chất chống phá, xuyên tạc.\n- Không phân biệt chủng tộc, tôn giáo.\n- Nội dung phải liên quan đến tiếng Đức và văn hóa Đức."
  );
  const [aiApiUrl, setAiApiUrl] = React.useState(
    "https://api.example.com/ai-moderator"
  );
  const [errorWebhookUrl, setErrorWebhookUrl] = React.useState(
    "https://discord.com/api/webhooks/....../......."
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quy tắc và Tự động hóa Blog</CardTitle>
        <CardDescription>
          Thiết lập các quy tắc cho bài viết và cấu hình AI để tự động kiểm
          duyệt nội dung.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Blog Rules Section */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="blog-rules" className="text-base font-semibold">
              Nội quy đăng bài
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Các quy tắc này sẽ được áp dụng cho tất cả bài viết do người dùng
              đóng góp. AI sẽ dựa vào đây để kiểm duyệt.
            </p>
          </div>
          <Textarea
            id="blog-rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows={6}
            placeholder="Nhập các quy tắc của bạn, mỗi quy tắc trên một dòng..."
          />
        </div>

        <Separator />

        {/* AI Integration Section */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="ai-api-url" className="text-base font-semibold">
              Tích hợp AI Kiểm duyệt
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Nhập URL API của dịch vụ AI để tự động quét và duyệt bài viết.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="ai-api-url"
              value={aiApiUrl}
              onChange={(e) => setAiApiUrl(e.target.value)}
              placeholder="https://api.example.com/ai-moderator"
            />
            <Button variant="outline">Kiểm tra</Button>
          </div>
        </div>

        <Separator />

        {/* Error Webhook Section */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="error-webhook" className="text-base font-semibold">
              Webhook Báo cáo Lỗi
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Nhập URL webhook (ví dụ: Discord) để nhận thông báo tức thì về các
              bài viết bị AI từ chối.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="error-webhook"
              value={errorWebhookUrl}
              onChange={(e) => setErrorWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Lưu thay đổi</Button>
      </CardFooter>
    </Card>
  );
}

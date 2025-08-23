"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function SepayWebhooksPage() {
  const [createQrApiUrl, setCreateQrApiUrl] = React.useState(
    "https://api.sepay.vn/v1/qr/create"
  );
  const [paymentWebhookUrl, setPaymentWebhookUrl] = React.useState(
    "https://api.deutsch.vn/webhooks/sepay/payment-received"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sepay Webhooks & API</CardTitle>
        <CardDescription>
          Cấu hình các API và Webhook để tích hợp với cổng thanh toán Sepay.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <div>
            <Label className="text-base font-semibold">
              API Tạo mã QR
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Endpoint API của Sepay để tạo mã QR thanh toán động cho mỗi giao dịch.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="create-qr-api"
              value={createQrApiUrl}
              onChange={(e) => setCreateQrApiUrl(e.target.value)}
              placeholder="https://api.sepay.vn/..."
            />
            <Button>Lưu</Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <Label className="text-base font-semibold">
              Webhook Xác nhận Thanh toán
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Endpoint trên hệ thống của bạn để Sepay có thể gửi thông báo khi nhận được thanh toán thành công.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="payment-webhook"
              value={paymentWebhookUrl}
              onChange={(e) => setPaymentWebhookUrl(e.target.value)}
              placeholder="https://your-app.com/webhooks/..."
            />
            <Button>Lưu</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

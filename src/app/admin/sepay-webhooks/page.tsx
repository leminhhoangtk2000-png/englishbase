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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import React from "react";

const transactions = [
  {
    id: "txn_1a2b3c",
    amount: "99,000đ",
    status: "Thành công",
    date: "2024-08-28 10:30:15",
  },
  {
    id: "txn_4d5e6f",
    amount: "49,000đ",
    status: "Thành công",
    date: "2024-08-28 09:15:45",
  },
  {
    id: "txn_7g8h9i",
    amount: "25,000đ",
    status: "Thất bại",
    date: "2024-08-27 15:05:22",
  },
  {
    id: "txn_j1k2l3",
    amount: "25,000đ",
    status: "Thành công",
    date: "2024-08-27 11:45:00",
  },
];


export default function SepayWebhooksPage() {
  const [createQrApiUrl, setCreateQrApiUrl] = React.useState(
    "https://api.sepay.vn/v1/qr/create"
  );
  const [paymentWebhookUrl, setPaymentWebhookUrl] = React.useState(
    "https://api.deutsch.vn/webhooks/sepay/payment-received"
  );

  return (
    <div className="space-y-8">
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

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử Giao dịch</CardTitle>
          <CardDescription>
            Theo dõi các giao dịch thanh toán đã được xử lý qua Sepay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Giao dịch</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === "Thành công" ? "default" : "destructive"}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
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

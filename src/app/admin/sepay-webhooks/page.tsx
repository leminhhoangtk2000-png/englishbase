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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { FileClock, CheckCircle2, XCircle, Hourglass, Info } from "lucide-react";
import { cn } from "@/lib/utils";


const transactions = [
  {
    id: "txn_1a2b3c",
    amount: "99,000đ",
    status: "Thành công",
    date: "2024-08-28 10:30:15",
    logs: [
        { timestamp: "2024-08-28 10:29:55", action: "Tạo yêu cầu thanh toán", status: "PENDING" },
        { timestamp: "2024-08-28 10:29:56", action: "Gửi yêu cầu tạo QR đến Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-28 10:29:58", action: "Nhận được mã QR từ Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-28 10:30:00", action: "Chờ người dùng quét mã...", status: "INFO" },
        { timestamp: "2024-08-28 10:30:12", action: "Nhận được webhook thanh toán từ Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-28 10:30:13", action: "Xác thực webhook thành công", status: "SUCCESS" },
        { timestamp: "2024-08-28 10:30:14", action: "Cập nhật trạng thái người dùng thành Premium", status: "SUCCESS" },
        { timestamp: "2024-08-28 10:30:15", action: "Hoàn tất giao dịch", status: "SUCCESS" },
    ]
  },
  {
    id: "txn_4d5e6f",
    amount: "49,000đ",
    status: "Thành công",
    date: "2024-08-28 09:15:45",
    logs: [
        { timestamp: "2024-08-28 09:15:30", action: "Tạo yêu cầu thanh toán", status: "PENDING" },
        { timestamp: "2024-08-28 09:15:31", action: "Gửi yêu cầu tạo QR đến Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-28 09:15:33", action: "Nhận được mã QR từ Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-28 09:15:42", action: "Nhận được webhook thanh toán từ Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-28 09:15:45", action: "Hoàn tất giao dịch", status: "SUCCESS" },
    ]
  },
  {
    id: "txn_7g8h9i",
    amount: "25,000đ",
    status: "Thất bại",
    date: "2024-08-27 15:05:22",
    logs: [
        { timestamp: "2024-08-27 15:05:01", action: "Tạo yêu cầu thanh toán", status: "PENDING" },
        { timestamp: "2024-08-27 15:05:02", action: "Gửi yêu cầu tạo QR đến Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-27 15:05:04", action: "Nhận được mã QR từ Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-27 15:05:10", action: "Chờ người dùng quét mã...", status: "INFO" },
        { timestamp: "2024-08-27 15:05:20", action: "Nhận được webhook thanh toán từ Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-27 15:05:21", action: "Xác thực webhook thất bại: Chữ ký không hợp lệ", status: "FAILURE" },
        { timestamp: "2024-08-27 15:05:22", action: "Giao dịch thất bại", status: "FAILURE" },
    ]
  },
  {
    id: "txn_j1k2l3",
    amount: "25,000đ",
    status: "Thành công",
    date: "2024-08-27 11:45:00",
    logs: [
        { timestamp: "2024-08-27 11:44:50", action: "Tạo yêu cầu thanh toán", status: "PENDING" },
        { timestamp: "2024-08-27 11:44:55", action: "Nhận được webhook thanh toán từ Sepay", status: "SUCCESS" },
        { timestamp: "2024-08-27 11:45:00", action: "Hoàn tất giao dịch", status: "SUCCESS" },
    ]
  },
];

const statusIcons: { [key: string]: React.ReactNode } = {
    SUCCESS: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    FAILURE: <XCircle className="h-4 w-4 text-red-500" />,
    PENDING: <Hourglass className="h-4 w-4 text-yellow-500" />,
    INFO: <Info className="h-4 w-4 text-blue-500" />,
};

const statusColors: { [key: string]: string } = {
    SUCCESS: "text-green-500",
    FAILURE: "text-red-500",
    PENDING: "text-yellow-500",
    INFO: "text-blue-500",
};


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
            Theo dõi các giao dịch thanh toán đã được xử lý qua Sepay. Nhấp vào một hàng để xem chi tiết.
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
                  <Dialog key={transaction.id}>
                    <DialogTrigger asChild>
                       <TableRow className="cursor-pointer">
                        <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === "Thành công" ? "default" : "destructive"}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                      </TableRow>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Chi tiết Giao dịch</DialogTitle>
                            <DialogDescription>
                                Theo dõi các bước xử lý của giao dịch <span className="font-mono">{transaction.id}</span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-4 text-sm py-4">
                            <div>
                                <p className="text-muted-foreground">Số tiền</p>
                                <p className="font-semibold">{transaction.amount}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Thời gian</p>
                                <p className="font-semibold">{transaction.date}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Trạng thái</p>
                                <div className="font-semibold">
                                     <Badge variant={transaction.status === "Thành công" ? "default" : "destructive"}>
                                        {transaction.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="border rounded-md max-h-96 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Thời gian</TableHead>
                                        <TableHead>Hành động</TableHead>
                                        <TableHead className="text-right w-[120px]">Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transaction.logs.map((log, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                            <TableCell>{log.action}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {statusIcons[log.status]}
                                                    <span className={cn(statusColors[log.status])}>{log.status}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

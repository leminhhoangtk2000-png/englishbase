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

export default function WebhooksPage() {
  const [premiumWebhookUrl, setPremiumWebhookUrl] = React.useState(
    "https://discord.com/api/webhooks/....../......."
  );
  const [reportWebhookUrl, setReportWebhookUrl] = React.useState(
    "https://discord.com/api/webhooks/....../......."
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Webhooks</CardTitle>
        <CardDescription>
          Quản lý các webhook để nhận thông báo về các sự kiện trên nền tảng.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Premium User Webhook */}
        <div className="space-y-3">
          <div>
            <Label className="text-base font-semibold">
              Thông báo kích hoạt Premium
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Nhập URL webhook để nhận thông báo tức thì mỗi khi có người dùng
              mới đăng ký gói Premium.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="premium-webhook"
              value={premiumWebhookUrl}
              onChange={(e) => setPremiumWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
            />
            <Button>Lưu</Button>
          </div>
        </div>

        <Separator />

        {/* Monthly Report Webhook */}
        <div className="space-y-3">
          <div>
            <Label className="text-base font-semibold">
              Báo cáo người dùng mới
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Nhập URL webhook để nhận thông báo mỗi khi có người dùng mới đăng ký tài khoản.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="report-webhook"
              value={reportWebhookUrl}
              onChange={(e) => setReportWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
            />
            <Button>Lưu</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

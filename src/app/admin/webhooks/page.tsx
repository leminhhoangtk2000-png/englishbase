"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import React from "react";

const existingWebhooks = [
    {
        id: "1",
        name: "Kích hoạt Premium",
        url: "https://discord.com/api/webhooks/....../.......",
        description: "Gửi thông báo mỗi khi có người dùng mới đăng ký gói Premium."
    },
    {
        id: "2",
        name: "Người dùng mới",
        url: "https://discord.com/api/webhooks/....../.......",
        description: "Gửi thông báo mỗi khi có người dùng mới đăng ký tài khoản."
    }
]

export default function WebhooksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Webhooks</CardTitle>
        <CardDescription>
          Quản lý các webhook để nhận thông báo về các sự kiện trên nền tảng. Bạn hiện có {existingWebhooks.length} webhook đang hoạt động.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="space-y-4">
              {existingWebhooks.map(webhook => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg border">
                      <div className="flex-1">
                          <p className="font-semibold">{webhook.name}</p>
                          <p className="text-sm text-muted-foreground mt-1 pr-4">{webhook.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive shrink-0">
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Xóa</span>
                      </Button>
                  </div>
              ))}
          </div>
      </CardContent>
    </Card>
  );
}

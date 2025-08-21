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
import { Trash2 } from "lucide-react";
import React from "react";

const existingWebhooks = [
    {
        id: "1",
        name: "Premium Activations",
        url: "https://discord.com/api/webhooks/....../.......",
    },
    {
        id: "2",
        name: "New User Signups",
        url: "https://discord.com/api/webhooks/....../.......",
    }
]

export default function WebhooksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Webhooks</CardTitle>
        <CardDescription>
          Thêm webhook để nhận thông báo về các sự kiện trên nền tảng.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Tên Webhook (Tùy chọn)</Label>
          <Input id="name" placeholder="Ví dụ: Premium Activations" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL Webhook</Label>
          <Input id="url" placeholder="https://discord.com/api/webhooks/..." type="url" />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button>Thêm Webhook</Button>
      </CardFooter>
      
      <Separator className="my-6" />

      <CardHeader className="pt-0">
          <CardTitle>Webhooks hiện có</CardTitle>
          <CardDescription>Bạn hiện có {existingWebhooks.length} webhook đang hoạt động.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="space-y-4">
              {existingWebhooks.map(webhook => (
                  <div key={webhook.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                      <div>
                          <p className="font-medium">{webhook.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{webhook.url}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, TestTube, AlertTriangle, CheckCircle } from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  levels: string[];
  isActive: boolean;
}

export default function WebhooksAdmin() {
  // User & Premium Webhooks (existing)
  const [premiumWebhookUrl, setPremiumWebhookUrl] = useState('');
  const [newUserWebhookUrl, setNewUserWebhookUrl] = useState('');
  
  // Comment Webhooks (new)
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: 'a1',
      name: 'A1 Level Webhook',
      url: '',
      levels: ['A1'],
      isActive: true
    },
    {
      id: 'a2',
      name: 'A2 Level Webhook', 
      url: '',
      levels: ['A2'],
      isActive: true
    },
    {
      id: 'b1',
      name: 'B1 Level Webhook',
      url: '',
      levels: ['B1'],
      isActive: true
    },
    {
      id: 'b2',
      name: 'B2 Level Webhook',
      url: '',
      levels: ['B2'],
      isActive: true
    }
  ]);
  
  const [testMessage, setTestMessage] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load saved webhooks
  useEffect(() => {
    loadWebhooks();
    loadUserWebhooks();
  }, []);

  const loadUserWebhooks = async () => {
    try {
      const response = await fetch('/api/admin/user-webhooks');
      if (response.ok) {
        const data = await response.json();
        setPremiumWebhookUrl(data.premiumWebhook || '');
        setNewUserWebhookUrl(data.newUserWebhook || '');
      }
    } catch (error) {
      console.error('Error loading user webhooks:', error);
    }
  };

  const loadWebhooks = async () => {
    try {
      const response = await fetch('/api/admin/webhooks');
      if (response.ok) {
        const data = await response.json();
        setWebhooks(prev => prev.map(webhook => {
          const saved = data.find((w: any) => w.id === webhook.id);
          return saved ? { ...webhook, url: saved.url, isActive: saved.isActive } : webhook;
        }));
      }
    } catch (error) {
      console.error('Error loading webhooks:', error);
    }
  };

  const saveWebhook = async (webhook: WebhookConfig) => {
    setSaving(webhook.id);
    try {
      const response = await fetch('/api/admin/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhook)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `${webhook.name} đã được lưu thành công!` });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Lỗi khi lưu ${webhook.name}` });
    } finally {
      setSaving(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const testWebhook = async (webhook: WebhookConfig) => {
    if (!webhook.url) {
      setMessage({ type: 'error', text: 'Vui lòng nhập URL webhook trước khi test!' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setTesting(webhook.id);
    try {
      const response = await fetch('/api/admin/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookId: webhook.id,
          message: testMessage || `🧪 Test webhook cho ${webhook.name}`
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Test webhook ${webhook.name} thành công!` });
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Test webhook ${webhook.name} thất bại!` });
    } finally {
      setTesting(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateWebhookUrl = (id: string, url: string) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, url } : w));
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w));
  };

  const saveUserWebhook = async (type: 'premium' | 'newUser', url: string) => {
    try {
      const response = await fetch('/api/admin/user-webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, url })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `${type === 'premium' ? 'Premium' : 'New User'} webhook đã được lưu!` });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Lỗi khi lưu ${type} webhook` });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discord Webhook Management</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý webhook Discord cho thông báo người dùng và bình luận
          </p>
        </div>
      </div>

      {message && (
        <Card className={`border-l-4 ${message.type === 'success' ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User & Premium Webhooks (Original) */}
      <div>
        <h2 className="text-2xl font-bold mb-4">User Event Webhooks</h2>
        <p className="text-muted-foreground mb-6">
          Webhooks để nhận thông báo về các sự kiện người dùng
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Premium User Webhook
              <Badge variant="outline">User Events</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="premium-webhook">Discord Webhook URL</Label>
              <Input
                id="premium-webhook"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={premiumWebhookUrl}
                onChange={(e) => setPremiumWebhookUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi có người dùng mới đăng ký gói Premium
              </p>
            </div>
            
            <Button
              onClick={() => saveUserWebhook('premium', premiumWebhookUrl)}
              disabled={!premiumWebhookUrl}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu Premium Webhook
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👥 New User Webhook
              <Badge variant="outline">User Events</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newuser-webhook">Discord Webhook URL</Label>
              <Input
                id="newuser-webhook"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={newUserWebhookUrl}
                onChange={(e) => setNewUserWebhookUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi có người dùng mới đăng ký tài khoản
              </p>
            </div>
            
            <Button
              onClick={() => saveUserWebhook('newUser', newUserWebhookUrl)}
              disabled={!newUserWebhookUrl}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu New User Webhook
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Comment Webhooks (New) */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Comment Notification Webhooks</h2>
        <p className="text-muted-foreground mb-6">
          Webhooks để nhận thông báo khi có bình luận mới theo từng cấp độ
        </p>
      </div>

      {/* Test Message Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Test Message for Comment Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="testMessage">Tin nhắn test (tùy chọn)</Label>
            <Textarea
              id="testMessage"
              placeholder="Nhập tin nhắn test hoặc để trống để sử dụng tin nhắn mặc định..."
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comment Webhook Configurations */}
      <div className="grid gap-6">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {webhook.name}
                  <div className="flex gap-1">
                    {webhook.levels.map(level => (
                      <Badge key={level} variant="secondary">{level}</Badge>
                    ))}
                    <Badge variant="outline">Comments</Badge>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={webhook.isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleWebhook(webhook.id)}
                  >
                    {webhook.isActive ? 'Kích hoạt' : 'Tắt'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`webhook-${webhook.id}`}>Discord Webhook URL</Label>
                <Input
                  id={`webhook-${webhook.id}`}
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhook.url}
                  onChange={(e) => updateWebhookUrl(webhook.id, e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Webhook sẽ nhận thông báo khi có bình luận mới trong các bài học cấp độ: {webhook.levels.join(', ')}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => saveWebhook(webhook)}
                  disabled={saving === webhook.id || !webhook.url}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving === webhook.id ? 'Đang lưu...' : 'Lưu'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => testWebhook(webhook)}
                  disabled={testing === webhook.id || !webhook.url}
                  className="flex items-center gap-2"
                >
                  <TestTube className="w-4 h-4" />
                  {testing === webhook.id ? 'Đang test...' : 'Test'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn cấu hình Discord Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Tạo Discord Webhook:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Vào Discord server → Chọn channel → Settings → Integrations</li>
              <li>Click "Create Webhook" → Đặt tên và chọn avatar</li>
              <li>Copy "Webhook URL" và paste vào ô trên</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">2. Phân loại thông báo:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li><strong>User Events:</strong> Premium subscriptions, New user registrations</li>
              <li><strong>A1 Comments:</strong> Bình luận từ bài học A1 và exercises A1</li>
              <li><strong>A2 Comments:</strong> Bình luận từ bài học A2 và exercises A2</li>
              <li><strong>B1 Comments:</strong> Bình luận từ bài học B1 và exercises B1</li>
              <li><strong>B2 Comments:</strong> Bình luận từ bài học B2 và exercises B2</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">3. Format thông báo bình luận:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              🆕 Bình luận mới trên [Tên bài học]<br/>
              👤 Người dùng: Tên user<br/>
              💬 Nội dung: "Nội dung bình luận..."<br/>
              🔗 Link: [URL để trả lời]
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">4. Format thông báo người dùng:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              🎯 Premium User: [Tên user] đã đăng ký Premium<br/>
              👥 New User: [Tên user] đã tạo tài khoản mới
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Settings, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface AIProvider {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
}

interface AIVocabularyConfig {
  preferredProviderId: string | null;
  fallbackProviderIds: string[];
  enableAutoFallback: boolean;
  maxRetries: number;
}

interface ConfigData {
  config: AIVocabularyConfig;
  providers: {
    preferred: AIProvider | null;
    fallback: AIProvider[];
    available: AIProvider[];
  };
}

export default function AIVocabularyConfig() {
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<AIVocabularyConfig>({
    preferredProviderId: null,
    fallbackProviderIds: [],
    enableAutoFallback: true,
    maxRetries: 3
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai-vocabulary-config');
      if (response.ok) {
        const data = await response.json();
        setConfigData(data.data);
        setFormData(data.data.config);
      } else {
        throw new Error('Failed to fetch configuration');
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      toast.error('Không thể tải cấu hình AI Vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/ai-vocabulary-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Cấu hình đã được lưu thành công');
        fetchConfig(); // Refresh data
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Không thể lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  const handleFallbackToggle = (providerId: string, checked: boolean) => {
    const newFallbackIds = checked
      ? [...formData.fallbackProviderIds, providerId]
      : formData.fallbackProviderIds.filter(id => id !== providerId);
    
    setFormData({
      ...formData,
      fallbackProviderIds: newFallbackIds
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <CardTitle>AI Vocabulary Search Configuration</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!configData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <CardTitle>AI Vocabulary Search Configuration</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">
            <AlertCircle className="h-6 w-6 mr-2" />
            Không thể tải cấu hình
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <CardTitle>AI Vocabulary Search Configuration</CardTitle>
        </div>
        <CardDescription>
          Cấu hình AI provider cho tính năng tìm kiếm từ vựng thông minh
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">Trạng thái hiện tại</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>AI chính:</span>
              <Badge variant={configData.providers.preferred ? "default" : "secondary"}>
                {configData.providers.preferred?.displayName || 'Chưa chọn'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AI dự phòng:</span>
              <span>{configData.providers.fallback.length} provider</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tự động dự phòng:</span>
              <span>{formData.enableAutoFallback ? 'Bật' : 'Tắt'}</span>
            </div>
          </div>
        </div>

        {/* Primary Provider Selection */}
        <div className="space-y-2">
          <Label>AI Provider chính *</Label>
          <Select 
            value={formData.preferredProviderId || ''} 
            onValueChange={(value) => setFormData({
              ...formData,
              preferredProviderId: value || null
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn AI provider chính cho tìm kiếm từ vựng" />
            </SelectTrigger>
            <SelectContent>
              {configData.providers.available.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  <div className="flex items-center gap-2">
                    <span>{provider.displayName}</span>
                    <Badge variant="outline" className="text-xs">
                      {provider.name}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            AI provider này sẽ được sử dụng đầu tiên khi tìm kiếm từ vựng không có trong cơ sở dữ liệu
          </p>
        </div>

        {/* Fallback Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Tự động sử dụng AI dự phòng</Label>
              <p className="text-xs text-gray-500 mt-1">
                Tự động chuyển sang AI khác nếu AI chính gặp lỗi
              </p>
            </div>
            <Switch
              checked={formData.enableAutoFallback}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                enableAutoFallback: checked
              })}
            />
          </div>

          {formData.enableAutoFallback && (
            <>
              <div className="space-y-2">
                <Label>Số lần thử lại tối đa</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxRetries}
                  onChange={(e) => setFormData({
                    ...formData,
                    maxRetries: parseInt(e.target.value) || 3
                  })}
                  className="w-32"
                />
                <p className="text-xs text-gray-500">
                  Số lần thử với các AI provider khác nhau trước khi báo lỗi
                </p>
              </div>

              <div className="space-y-3">
                <Label>AI Providers dự phòng</Label>
                <div className="space-y-2">
                  {configData.providers.available
                    .filter(p => p.id !== formData.preferredProviderId)
                    .map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="font-medium">{provider.displayName}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {provider.name}
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={formData.fallbackProviderIds.includes(provider.id)}
                          onCheckedChange={(checked) => handleFallbackToggle(provider.id, checked)}
                        />
                      </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500">
                  Chọn các AI provider sẽ được sử dụng như phương án dự phòng
                </p>
              </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Lưu cấu hình
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

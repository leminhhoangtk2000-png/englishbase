"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTTS } from '@/hooks/use-tts';
import { Volume2, VolumeX, RotateCcw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminTTSSettings() {
  const { settings, updateSettings, resetSettings } = useTTS();
  const { toast } = useToast();

  const handleTestSpeech = () => {
    if (settings.enabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Hallo, dies ist ein Test der deutschen Aussprache.");
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      
      const voices = speechSynthesis.getVoices();
      const germanVoice = voices.find(voice => voice.lang.includes('de'));
      if (germanVoice) {
        utterance.voice = germanVoice;
      }
      
      speechSynthesis.speak(utterance);
      toast({
        title: "Test phát âm",
        description: "Đang phát âm thử nghiệm...",
        variant: "default",
      });
    } else {
      toast({
        title: "Không thể test",
        description: "TTS chưa được bật hoặc trình duyệt không hỗ trợ.",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Đặt lại cài đặt",
      description: "Tất cả cài đặt TTS đã được đặt về mặc định.",
      variant: "default",
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Cài đặt Text-to-Speech (TTS)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="tts-enabled" className="text-base font-medium">
            Bật Text-to-Speech
          </Label>
          <Switch
            id="tts-enabled"
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          />
        </div>

        {settings.enabled && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tốc độ đọc: {settings.rate.toFixed(1)}x
              </Label>
              <Slider
                value={[settings.rate]}
                onValueChange={(value) => updateSettings({ rate: value[0] })}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Chậm (0.5x)</span>
                <span>Bình thường (1.0x)</span>
                <span>Nhanh (2.0x)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Cao độ giọng: {settings.pitch.toFixed(1)}
              </Label>
              <Slider
                value={[settings.pitch]}
                onValueChange={(value) => updateSettings({ pitch: value[0] })}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Thấp (0.5)</span>
                <span>Bình thường (1.0)</span>
                <span>Cao (2.0)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Âm lượng: {Math.round(settings.volume * 100)}%
              </Label>
              <Slider
                value={[settings.volume]}
                onValueChange={(value) => updateSettings({ volume: value[0] })}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span><VolumeX className="h-3 w-3 inline" /> 0%</span>
                <span><Volume2 className="h-3 w-3 inline" /> 100%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-play" className="text-sm font-medium">
                Tự động phát âm khi tìm kiếm
              </Label>
              <Switch
                id="auto-play"
                checked={settings.autoPlay}
                onCheckedChange={(autoPlay) => updateSettings({ autoPlay })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleTestSpeech} variant="default">
                <Volume2 className="h-4 w-4 mr-2" />
                Test phát âm
              </Button>
              <Button onClick={handleResetSettings} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Đặt lại mặc định
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Cài đặt hiện tại</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="ml-2 font-medium">
                    {settings.enabled ? 'Đã bật' : 'Đã tắt'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tốc độ:</span>
                  <span className="ml-2 font-medium">{settings.rate}x</span>
                </div>
                <div>
                  <span className="text-gray-600">Cao độ:</span>
                  <span className="ml-2 font-medium">{settings.pitch}</span>
                </div>
                <div>
                  <span className="text-gray-600">Âm lượng:</span>
                  <span className="ml-2 font-medium">{Math.round(settings.volume * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn sử dụng</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tốc độ đọc chậm (0.7-0.9x) phù hợp cho người mới học</li>
                <li>• Cao độ giọng bình thường (1.0) thường cho âm thanh tự nhiên nhất</li>
                <li>• Cài đặt sẽ được lưu tự động trong localStorage</li>
                <li>• Bật "Tự động phát âm" để nghe từ ngay khi tìm kiếm</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminTTSSettings;

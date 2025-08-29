"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, RotateCcw, Speaker } from 'lucide-react';
import { useTTS } from '@/hooks/use-tts';
import { getGermanVoices, speakGerman } from '@/lib/text-to-speech';

export function TTSSettings() {
  const { settings, updateSettings, resetSettings } = useTTS();
  const [voices] = React.useState(() => getGermanVoices());

  const handleTest = async () => {
    try {
      await speakGerman("Hallo, das ist ein Test der deutschen Aussprache.", {
        rate: settings.rate,
        pitch: settings.pitch,
        volume: settings.volume
      });
    } catch (error) {
      console.error('Test speech error:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Speaker className="h-5 w-5" />
          Cài đặt phát âm
        </CardTitle>
        <CardDescription>
          Điều chỉnh các thông số phát âm tiếng Đức để tối ưu trải nghiệm học tập
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable TTS */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tts-enabled" className="text-base font-medium">
              Bật phát âm
            </Label>
            <p className="text-sm text-muted-foreground">
              Cho phép phát âm từ vựng tiếng Đức
            </p>
          </div>
          <Switch
            id="tts-enabled"
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Speech Rate */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Tốc độ đọc: {settings.rate.toFixed(1)}x
              </Label>
              <Slider
                value={[settings.rate]}
                onValueChange={([rate]) => updateSettings({ rate })}
                max={2.0}
                min={0.3}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Chậm (0.3x)</span>
                <span>Bình thường (1.0x)</span>
                <span>Nhanh (2.0x)</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Cao độ: {settings.pitch.toFixed(1)}
              </Label>
              <Slider
                value={[settings.pitch]}
                onValueChange={([pitch]) => updateSettings({ pitch })}
                max={2.0}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Thấp (0.5)</span>
                <span>Bình thường (1.0)</span>
                <span>Cao (2.0)</span>
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Âm lượng: {Math.round(settings.volume * 100)}%
              </Label>
              <Slider
                value={[settings.volume]}
                onValueChange={([volume]) => updateSettings({ volume })}
                max={1.0}
                min={0.1}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Available Voices */}
            {voices.length > 0 && (
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Giọng đọc có sẵn ({voices.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {voices.map((voice, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {voice.name} ({voice.lang})
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hệ thống sẽ tự động chọn giọng đọc tiếng Đức tốt nhất
                </p>
              </div>
            )}

            {/* Auto-play setting */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-play" className="text-base font-medium">
                  Tự động phát âm
                </Label>
                <p className="text-sm text-muted-foreground">
                  Tự động phát âm khi xem chi tiết từ vựng
                </p>
              </div>
              <Switch
                id="auto-play"
                checked={settings.autoPlay}
                onCheckedChange={(autoPlay) => updateSettings({ autoPlay })}
              />
            </div>

            {/* Test and Reset buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleTest}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Thử nghiệm
              </Button>
              <Button
                onClick={resetSettings}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Đặt lại mặc định
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TTSSettings;

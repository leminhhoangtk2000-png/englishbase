"use client";

import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speakGerman, stopSpeech, isTTSSupported } from '@/lib/text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { useTTS } from '@/hooks/use-tts';

interface SpeechButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  disabled?: boolean;
}

export function SpeechButton({ 
  text, 
  size = 'sm', 
  variant = 'ghost',
  className = '',
  disabled = false
}: SpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { settings } = useTTS();

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click events
    
    if (!settings.enabled) {
      toast({
        title: "Phát âm đã tắt",
        description: "Bạn có thể bật lại trong cài đặt.",
        variant: "default",
      });
      return;
    }
    
    if (!isTTSSupported()) {
      toast({
        title: "Không hỗ trợ",
        description: "Trình duyệt của bạn không hỗ trợ phát âm văn bản.",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying) {
      // Stop current speech
      stopSpeech();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsPlaying(true);
      
      await speakGerman(text, {
        rate: settings.rate,
        pitch: settings.pitch,
        volume: settings.volume
      });
      
      setIsPlaying(false);
    } catch (error) {
      console.error('Speech error:', error);
      toast({
        title: "Lỗi phát âm",
        description: "Không thể phát âm từ này. Vui lòng thử lại.",
        variant: "destructive",
      });
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'md': return 'h-10 w-10';
      case 'lg': return 'h-12 w-12';
      default: return 'h-8 w-8';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  };

  if (!isTTSSupported()) {
    return null; // Don't render if not supported
  }

  return (
    <Button
      variant={variant}
      size="icon"
      className={`${getButtonSize()} ${className} transition-colors hover:bg-teal-100 hover:text-teal-700`}
      onClick={handleSpeak}
      disabled={disabled || isLoading}
      title={isPlaying ? "Dừng phát âm" : "Phát âm"}
    >
      {isLoading ? (
        <Loader2 className={`${getIconSize()} animate-spin`} />
      ) : isPlaying ? (
        <VolumeX className={getIconSize()} />
      ) : (
        <Volume2 className={getIconSize()} />
      )}
      <span className="sr-only">
        {isPlaying ? "Dừng phát âm" : "Phát âm"}
      </span>
    </Button>
  );
}

export default SpeechButton;

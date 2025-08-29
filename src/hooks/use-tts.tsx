"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TTSSettings {
  enabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
  autoPlay: boolean;
  preferredVoice: string | null;
}

interface TTSContextType {
  settings: TTSSettings;
  updateSettings: (settings: Partial<TTSSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: TTSSettings = {
  enabled: true,
  rate: 0.8,
  pitch: 1.0,
  volume: 1.0,
  autoPlay: false,
  preferredVoice: null,
};

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<TTSSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('tts-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading TTS settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('tts-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<TTSSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <TTSContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </TTSContext.Provider>
  );
}

export function useTTS() {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
}

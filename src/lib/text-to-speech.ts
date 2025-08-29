/**
 * Text-to-Speech utilities for German pronunciation
 */

interface SpeechOptions {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      
      // Handle voice loading (some browsers load voices async)
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices(): void {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  /**
   * Get available German voices
   */
  getGermanVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith('de') || 
      voice.lang.includes('de-') ||
      voice.name.toLowerCase().includes('german')
    );
  }

  /**
   * Get the best German voice available
   */
  getBestGermanVoice(): SpeechSynthesisVoice | null {
    const germanVoices = this.getGermanVoices();
    
    if (germanVoices.length === 0) {
      return null;
    }

    // Prefer specific German locales
    const preferredLocales = ['de-DE', 'de-AT', 'de-CH'];
    
    for (const locale of preferredLocales) {
      const voice = germanVoices.find(v => v.lang === locale);
      if (voice) return voice;
    }

    // Return first German voice if no preferred locale found
    return germanVoices[0];
  }

  /**
   * Speak German text
   */
  speakGerman(text: string, options: Partial<SpeechOptions> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.synth) {
        reject(new Error('Text-to-Speech not supported in this browser'));
        return;
      }

      // Stop any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set German voice
      const germanVoice = this.getBestGermanVoice();
      if (germanVoice) {
        utterance.voice = germanVoice;
        utterance.lang = germanVoice.lang;
      } else {
        utterance.lang = 'de-DE'; // Fallback to German
      }

      // Set speech parameters
      utterance.rate = options.rate || 0.9; // Slightly slower for learning
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Handle events
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`));

      // Speak
      this.synth.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Check if TTS is supported
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Get all available voices for debugging
   */
  getAllVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// Create singleton instance
const ttsService = new TextToSpeechService();

export default ttsService;

// Export utility functions
export const speakGerman = (text: string, options?: Partial<SpeechOptions>) => {
  return ttsService.speakGerman(text, options);
};

export const stopSpeech = () => {
  ttsService.stop();
};

export const isTTSSupported = () => {
  return ttsService.isAvailable();
};

export const getGermanVoices = () => {
  return ttsService.getGermanVoices();
};

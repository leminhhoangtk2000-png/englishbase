"use client";

import { VocabularyProvider } from "@/hooks/use-vocabulary";
import { TTSProvider } from "@/hooks/use-tts";
import { VocabularyPageContent } from "@/components/vocabulary-page-content";

export default function VocabularyPage() {
  return (
    <div className="container mx-auto" style={{ paddingLeft: '13.75rem', paddingRight: '13.75rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Thư viện từ vựng</h1>
        <p className="text-muted-foreground text-center">
          Tìm kiếm và học từ vựng tiếng Đức theo cấp độ và chủ đề
        </p>
      </div>
      
      <VocabularyProvider>
        <TTSProvider>
          <VocabularyPageContent />
        </TTSProvider>
      </VocabularyProvider>
    </div>
  )
}

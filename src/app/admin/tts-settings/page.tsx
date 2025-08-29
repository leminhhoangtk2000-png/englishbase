import { AdminTTSSettings } from '@/components/admin-tts-settings';

export default function TTSSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cài đặt Text-to-Speech</h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý cài đặt phát âm và text-to-speech cho toàn bộ hệ thống.
          </p>
        </div>
      </div>
      
      <AdminTTSSettings />
    </div>
  );
}

import TTSSettings from '@/components/tts-settings';

export default function TTSTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cài đặt phát âm tiếng Đức
          </h1>
          <p className="text-gray-600">
            Điều chỉnh các thông số phát âm để tối ưu trải nghiệm học tập của bạn
          </p>
        </div>
        
        <div className="flex justify-center">
          <TTSSettings />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            💡 Mẹo: Hãy thử nghiệm các cài đặt khác nhau để tìm ra âm thanh phù hợp nhất với bạn.
            Tốc độ chậm hơn (0.6-0.8x) thường tốt hơn cho việc học từ vựng mới.
          </p>
        </div>
      </div>
    </div>
  );
}

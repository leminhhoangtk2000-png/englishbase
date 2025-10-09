'use client';

import TeamIntroduction from '@/components/TeamIntroduction';

export default function AboutTeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Về Đội Ngũ Deutsch.vn
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tìm hiểu về những con người đằng sau nền tảng giáo dục tiếng Đức hàng đầu Việt Nam
          </p>
        </div>

        {/* Team Introduction Component */}
        <TeamIntroduction />
      </div>
    </div>
  );
}

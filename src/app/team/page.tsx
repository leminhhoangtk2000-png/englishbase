'use client';

import { MainNav } from "@/components/main-nav";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamPage() {
  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* First Section - Khoa Võ */}
        <div className="max-w-4xl mx-auto mb-24">
          {/* Header */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-4">Über Uns</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Deutsch.vn được tạo ra bởi...
            </h1>
          </div>

          {/* Main Content Grid - Avatar and Text Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            {/* Left Column - Avatar */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-64 h-64 bg-black dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                {/* Simple avatar matching the reference image */}
                <svg width="240" height="240" viewBox="0 0 240 240" className="text-white">
                  {/* Face */}
                  <circle cx="120" cy="120" r="110" fill="currentColor"/>
                  
                  {/* Hair */}
                  <path d="M60 80 Q120 40 180 80 Q180 100 160 110 Q140 100 120 100 Q100 100 80 110 Q60 100 60 80" fill="currentColor"/>
                  
                  {/* Hair bangs */}
                  <path d="M85 85 Q95 75 105 85 Q115 75 125 85 Q135 75 145 85 Q155 75 165 85" stroke="currentColor" strokeWidth="3" fill="none"/>
                  
                  {/* Eyes */}
                  <circle cx="95" cy="105" r="3" fill="currentColor"/>
                  <circle cx="145" cy="105" r="3" fill="currentColor"/>
                  
                  {/* Eye lines */}
                  <path d="M85 100 Q95 95 105 100" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M135 100 Q145 95 155 100" stroke="currentColor" strokeWidth="2" fill="none"/>
                  
                  {/* Nose */}
                  <line x1="120" y1="115" x2="120" y2="125" stroke="currentColor" strokeWidth="2"/>
                  
                  {/* Mouth */}
                  <path d="M105 145 Q120 155 135 145" stroke="currentColor" strokeWidth="3" fill="none"/>
                  
                  {/* Ears */}
                  <ellipse cx="65" cy="120" rx="8" ry="15" fill="currentColor"/>
                  <ellipse cx="175" cy="120" rx="8" ry="15" fill="currentColor"/>
                  
                  {/* Neck */}
                  <rect x="105" y="210" width="30" height="30" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Right Column - Content (spans 2 columns) */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Khoa Võ
              </h2>
              <p className="text-gray-500 italic mb-6">Founder</p>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Mình phụ trách nội dung, thiết kế và chiến lược marketing. Mình đã khởi nghiệp được hơn 5 năm với rất nhiều dự án. Trong quá trình khởi nghiệp, mình đã học rất nhiều chứng chỉ về nghiệp vụ kế toán và quản trị. Qua quá trình làm hồ sơ đi du học, mình nhận ra rằng thị trường du học đang tồn tại rất nhiều rủi ro. Những rủi ro này đều đổ dồn về phía người sử dụng dịch vụ. Mình hiểu rất rõ nguồn gốc cũng như nguyên nhân của những rủi ro đó. Chính vì vậy, mình muốn tạo ra một giải pháp có thể giúp bảo vệ quyền lợi của người sử dụng dịch vụ trong lĩnh vực này.
                </p>
              </div>
            </div>
          </div>

          {/* Achievement Cards - Full Width Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  5 Năm Khởi Nghiệp
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kinh nghiệm phát triển dự án.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Xây Dựng Cộng Đồng
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sáng lập cộng đồng tiếng Đức.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Du Học Sinh
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hiện đang học tại Wien (Áo).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Separator */}
        <div className="max-w-4xl mx-auto mb-24">
          <hr className="border-gray-200 dark:border-gray-700" />
        </div>

        {/* Second Section - Lonia */}
        <div className="max-w-4xl mx-auto mb-24">
          {/* Header */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-4">Über Uns</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Deutsch.vn được hỗ trợ bởi...
            </h1>
          </div>

          {/* Main Content Grid - Avatar and Text Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            {/* Left Column - Avatar */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-64 h-64 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <svg width="200" height="200" viewBox="0 0 200 200" className="text-white dark:text-gray-900">
                  <circle cx="100" cy="75" r="20" fill="currentColor"/>
                  <path d="M100 100 Q90 110 90 125 L110 125 Q110 110 100 100" fill="currentColor"/>
                  <path d="M75 120 Q100 140 125 120" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="85" cy="60" r="2" fill="currentColor"/>
                  <circle cx="115" cy="60" r="2" fill="currentColor"/>
                  <path d="M70 150 L130 150 L125 170 L75 170 Z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Right Column - Content (spans 2 columns) */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Lonia
              </h2>
              <p className="text-gray-500 italic mb-6">Người trẻ năng kài</p>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Hallo zusammen! 👋
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Mình là một Gen Z đang đồng hành cùng các bạn trên hành trình chinh phục tiếng Đức 🇩🇪
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Hồi mới bắt đầu, mình cũng từng hoang mang không biết nên học ở đâu, trang tâm nào uy tín, học phí có ổn không... Thấm chí đã sơn sài chỗ vài phải đôi giữa chúng 😭
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  May mắn là sau đó mình tìm được nơi phù hợp học. Và mình ở đây — để chia sẻ kinh nghiệm, giúp bạn tránh lạc hướng như mình từng trải qua!
                </p>
              </div>
            </div>
          </div>

          {/* Achievement Cards - Full Width Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Mình ở đây vì
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mình ở đây để chia sẻ kinh nghiệm và hỗ trợ các bạn tiến bước hành trình học tiếng Đức, giúp mọi thứ dễ hiểu và vui vẻ nhất có thể.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Kinh nghiệm
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1 năm kinh nghiệm làm gia sư tiếng Đức cho các em chỉ từ tuổi.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Sự đóng góp của Lonia
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bài tập ngữ pháp A1 - A2.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Third Section - Vũ Nhật Nam */}
        <div className="max-w-4xl mx-auto">
          {/* Main Content Grid - Avatar and Text Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            {/* Left Column - Avatar */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-64 h-64 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <svg width="200" height="200" viewBox="0 0 200 200" className="text-white dark:text-gray-900">
                  <circle cx="100" cy="75" r="22" fill="currentColor"/>
                  <rect x="85" y="65" width="30" height="20" rx="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M100 100 Q90 110 90 125 L110 125 Q110 110 100 100" fill="currentColor"/>
                  <path d="M75 120 Q100 140 125 120" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M70 150 L130 150 L125 170 L75 170 Z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Right Column - Content (spans 2 columns) */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Vũ Nhật Nam
              </h2>
              <p className="text-gray-500 italic mb-6">der Mighty Vermittler</p>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Hallochen. 👋
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Mình là Nam và mình thích việc chia sẻ lại những kiến thức tiếng Đức mình học được cho mọi người. Mình hy vọng thông qua những bài chia sẻ của mình trên này, mọi người sẽ học thêm được gì đó và yêu tiếng Đức hơn. 🇩🇪❤️ Mong được đón nhận những feedback góp ý của mọi người, để mình một hoàn thiện hơn!! 🙏
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Viel Spass beim Deutschlernen! 😊
                </p>
              </div>
            </div>
          </div>

          {/* Achievement Cards - Full Width Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Thành tích học tập
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  B3 A2A A1 B2 Goethe trong lần thi đầu tiên - Đạt 96/100 Schreiben B2.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Kinh nghiệm
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  2 năm làm trợ giảng, hỗ trợ các bạn trên từ A1-B1
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Sự đóng góp của Nam
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Grammatik B2 - Vokabular B2
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { MainNav } from "@/components/main-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Tại sao bọn mình ở đây!</h1>
        </div>

        {/* Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            {/* Placeholder for illustration */}
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Illustration 1</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-4">Mình đã từng học tiếng Đức tại nhiều trung tâm!</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nhưng 3 trong 4 trung tâm mình học đều có chất lượng kém. Thầm chí mình còn bị lừa bởi một thầy giáo dạy tiếng Đức.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            {/* Placeholder for illustration */}
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Illustration 2</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Mình hiểu cảm giác hoang mang của bạn.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Tiếng Đức ở Việt Nam chỉ bùng nổ trong 5-7 năm qua. Vừa có mặt, thị trường chưa có một đơn vị nào có uy tín để dẫn đầu. Người học phải tự mình mò mẫm, tự đánh giá chất lượng bằng... niềm tin.
            </p>
            <p className="text-muted-foreground font-medium">
              Đó là vấn đề!
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            {/* Placeholder for illustration */}
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Illustration 3</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-6">Bọn mình muốn thay đổi điều đó.</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Bọn mình không phải là một trung tâm tiếng Đức. Cũng không phải là một công ty tư vấn du học.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Deutsch.vn là câu nói, là nơi bao về quyền lợi cho cả người học và các đơn vị cung cấp dịch vụ uy tín.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Deutsch.vn có 3 giai đoạn chính:</h3>
              </div>
              
              <div className="pl-4 border-l-4 border-blue-500">
                <h4 className="font-medium mb-1">Giai đoạn 1:</h4>
                <p className="text-sm text-muted-foreground">
                  Bọn mình xây dựng một nền tảng tuyệt vời để miễn phí những thức sự hiệu quả. Dư trên những tài liệu minh có từ nước ngoài (cụ thể là Áo).
                </p>
              </div>
              
              <div className="pl-4 border-l-4 border-green-500">
                <h4 className="font-medium mb-1">Giai đoạn 2:</h4>
                <p className="text-sm text-muted-foreground">
                  Bọn mình sẽ giúp các cơ sở dạy tiếng Đức có tầm phát triển khóa học, đồng thời tạo ra một hệ thống đánh giá minh bạch từ chính học viên.
                </p>
              </div>
              
              <div className="pl-4 border-l-4 border-purple-500">
                <h4 className="font-medium mb-1">Giai đoạn 3:</h4>
                <p className="text-sm text-muted-foreground">
                  Bọn mình trở thành một đơn vị kiểm định độc lập, giúp bảo vệ tồn lại chính của người học trước những rủi ro không đáng có.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            {/* Placeholder for illustration */}
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Illustration 4</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Hãy cùng nhau xây dựng thị trường!</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Đây không chỉ là một nền tảng học tập. Đây là một phong trào, một cộng đồng.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bọn mình tin rằng nếu mỗi người góp một chút—dù là thử nghiệm nền tảng, đóng góp ý kiến, hay chia sẻ trải nghiệm—chúng ta có thể tạo ra một thị trường học tiếng Đức minh bạch và công bằng hơn.
            </p>
            <p className="text-muted-foreground font-medium mb-6">
              Hãy cùng nhau làm một thỉ đẹp nhé!
            </p>
          </div>
        </div>

        {/* Team Section */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold mb-6">Đội ngũ sáng lập</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>Minh</strong> là Khoa Vỏ, người chịu trách nhiệm cho <strong>nội dung</strong>.
              </p>
              <p>
                <strong>Tuấn Anh Đỗ</strong>, người chịu trách nhiệm cho <strong>phần xây dựng hệ thống</strong>.
              </p>
              <p className="text-sm">
                Đọc thêm về bọn mình. <Link href="#" className="text-primary hover:underline font-medium">Tại đây! 🔥</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

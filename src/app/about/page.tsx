import { MainNav } from "@/components/main-nav";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Về chúng tôi</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Câu chuyện về hành trình tạo nên một nền tảng học tiếng Đức minh bạch và hiệu quả
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <div className="w-full h-48 sm:h-56 lg:h-64 bg-white border rounded-lg overflow-hidden shadow-sm">
              <img 
                src="/about/1.jpg" 
                alt="Học tiếng Đức tại nhiều trung tâm"
                className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-4">Mình đã từng học tiếng Đức tại nhiều trung tâm!</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nhưng 3 trong 4 trung tâm mình học đều có chất lượng kém. Thậm chí mình còn bị lừa bởi một thầy giáo dạy tiếng Đức.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="w-full h-48 sm:h-56 lg:h-64 bg-white border rounded-lg overflow-hidden shadow-sm">
              <img 
                src="/about/2.jpg" 
                alt="Cảm giác hoang mang khi học tiếng Đức"
                className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
              />
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
            <div className="w-full h-48 sm:h-56 lg:h-64 bg-white border rounded-lg overflow-hidden shadow-sm">
              <img 
                src="/about/3.jpg" 
                alt="Thay đổi thị trường học tiếng Đức"
                className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-6">Bọn mình muốn thay đổi điều đó.</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Bọn mình không phải là một trung tâm tiếng Đức. Cũng không phải là một công ty tư vấn du học.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Deutsch.vn là câu nói, là nơi bảo vệ quyền lợi cho cả người học và các đơn vị cung cấp dịch vụ uy tín.
            </p>
          </div>
        </div>

        {/* Section 4 - 3 giai đoạn */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          <div>
            <div className="w-full h-48 sm:h-56 lg:h-64 bg-white border rounded-lg overflow-hidden shadow-sm">
              <img 
                src="/about/4.jpg" 
                alt="3 giai đoạn chính của Deutsch.vn"
                className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Deutsch.vn có 3 giai đoạn chính</h2>
            
            <div className="space-y-4">
              <div className="pl-4 border-l-4 border-blue-500">
                <h4 className="font-medium mb-1">Giai đoạn 1:</h4>
                <p className="text-sm text-muted-foreground">
                  Bọn mình xây dựng một nền tảng tuyệt vời để miễn phí những thứ thực sự hiệu quả. Dựa trên những tài liệu mình có từ nước ngoài (cụ thể là Áo).
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
                  Bọn mình trở thành một đơn vị kiểm định độc lập, giúp bảo vệ quyền lợi chính của người học trước những rủi ro không đáng có.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <div className="w-full h-48 sm:h-56 lg:h-64 bg-white border rounded-lg overflow-hidden shadow-sm">
              <img 
                src="/about/5.jpg" 
                alt="Xây dựng thị trường cùng nhau"
                className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-6">Hãy cùng nhau xây dựng thị trường!</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Đây không chỉ là một nền tảng học tập. Đây là một phong trào, một cộng đồng.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bọn mình tin rằng nếu mỗi người góp một chút—dù là thử nghiệm nền tảng, đóng góp ý kiến, hay chia sẻ trải nghiệm—chúng ta có thể tạo ra một thị trường học tiếng Đức minh bạch và công bằng hơn.
            </p>
            <p className="text-muted-foreground font-medium">
              Hãy cùng nhau làm một thị trường đẹp nhé!
            </p>
          </div>
        </div>

        {/* Đội ngũ sáng lập */}
        <div className="text-center mt-20">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <h3 className="text-2xl font-bold mb-6">Đội ngũ sáng lập</h3>
            <div className="max-w-2xl mx-auto text-left">
              <p className="text-muted-foreground mb-4">
                <strong>Mình là Khoa Võ</strong>, người chịu trách nhiệm cho nội dung.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Tuấn Anh Đỗ</strong>, người chịu trách nhiệm cho phần xây dựng hệ thống.
              </p>
              <p className="text-muted-foreground">
                Đọc thêm về bọn mình. <span className="text-orange-500 font-medium">Tại đây! 🔥</span>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

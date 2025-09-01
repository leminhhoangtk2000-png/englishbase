'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Shield, Zap, Star, Users, Check } from 'lucide-react';
import { MainNav } from '@/components/main-nav';

const testimonials = [
  {
    name: 'Siêu nhân hồng',
    role: 'Thành viên kim cương',
    quote: 'Môi trường học tập ở đây thật tuyệt vời và đầy cảm hứng!',
    avatar: 'https://placehold.co/48x48.png',
    rating: 5,
  },
  {
    name: 'Siêu nhân đỏ',
    role: 'Thành viên bạc',
    quote: 'Nhờ có Deutsch.vn, mình đã tự tin hơn rất nhiều trên con đường chinh phục tiếng Đức.',
    avatar: 'https://placehold.co/48x48.png',
    rating: 5,
  },
  {
    name: 'Siêu nhân vàng',
    role: 'Người đi đường',
    quote: 'Cộng đồng đã giúp đỡ mình rất nhiều, từ kiến thức đến kinh nghiệm thực tế.',
    avatar: 'https://placehold.co/48x48.png',
    rating: 4,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <MainNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 overflow-hidden">
          {/* Enhanced Decorative Background Elements */}
          <div className="absolute inset-0 -z-10">
            {/* Animated gradient orbs */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse [animation-delay:0s] [animation-duration:4s]"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-lg animate-pulse [animation-delay:2s] [animation-duration:5s]"></div>
            <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-green-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse [animation-delay:1s] [animation-duration:6s]"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-yellow-400/25 to-orange-400/25 rounded-full blur-xl animate-pulse [animation-delay:3s] [animation-duration:4.5s]"></div>

            {/* Floating geometric shapes */}
            <div className="absolute top-32 left-1/4 w-4 h-4 bg-blue-500/60 rotate-45 animate-float [animation-delay:0s] [animation-duration:8s]"></div>
            <div className="absolute top-60 right-1/4 w-3 h-3 bg-purple-500/50 rotate-12 animate-float [animation-delay:2s] [animation-duration:7s]"></div>
            <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-green-500/40 rotate-45 animate-float [animation-delay:4s] [animation-duration:9s]"></div>
            
            {/* Constellation lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.4">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
              </line>
              <line x1="70%" y1="15%" x2="85%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.4">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="5s" repeatCount="indefinite" />
              </line>
              <line x1="20%" y1="60%" x2="40%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.4">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="6s" repeatCount="indefinite" />
              </line>
              <line x1="60%" y1="70%" x2="80%" y2="85%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.4">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3.5s" repeatCount="indefinite" />
              </line>
            </svg>
            
            {/* Colored dots with enhanced animation */}
            <div className="absolute top-20 left-10 w-3 h-3 bg-purple-500 rounded-full opacity-60 animate-float [animation-delay:0s]"></div>
            <div className="absolute top-32 left-32 w-2 h-2 bg-blue-500 rounded-full opacity-70 animate-float [animation-delay:1s]"></div>
            <div className="absolute top-16 right-20 w-4 h-4 bg-green-500 rounded-full opacity-50 animate-float [animation-delay:2s]"></div>
            <div className="absolute top-40 right-40 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-float [animation-delay:0.5s]"></div>
            <div className="absolute bottom-32 left-20 w-3 h-3 bg-yellow-500 rounded-full opacity-70 animate-float [animation-delay:1.5s]"></div>
            <div className="absolute bottom-20 right-16 w-2 h-2 bg-pink-500 rounded-full opacity-60 animate-float [animation-delay:2.5s]"></div>
            
            {/* Medium dots */}
            <div className="absolute top-60 left-60 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-float [animation-delay:0.7s]"></div>
            <div className="absolute top-80 right-60 w-8 h-8 bg-green-400 rounded-full opacity-30 animate-float [animation-delay:1.3s]"></div>
            <div className="absolute bottom-60 left-40 w-5 h-5 bg-purple-400 rounded-full opacity-50 animate-float [animation-delay:1.8s]"></div>
            
            {/* Large decorative circles with glow effect */}
            <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-float [animation-delay:0.3s] shadow-2xl shadow-blue-500/20"></div>
            <div className="absolute bottom-10 left-10 w-20 h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 animate-float [animation-delay:2.2s] shadow-2xl shadow-green-500/20"></div>
            
            {/* Large partial circles with enhanced gradients */}
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full opacity-30 animate-pulse [animation-duration:8s]"></div>
            <div className="absolute -top-32 -right-32 w-48 h-48 bg-gradient-to-br from-pink-300/30 to-yellow-300/30 rounded-full opacity-25 animate-pulse [animation-duration:10s] [animation-delay:2s]"></div>

            {/* Sparkle effects with twinkling */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-80 animate-ping [animation-delay:1s] [animation-duration:3s] shadow-lg shadow-white/50"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-yellow-300 rounded-full opacity-80 animate-ping [animation-delay:3s] [animation-duration:2s] shadow-lg shadow-yellow-300/50"></div>
            <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-80 animate-ping [animation-delay:5s] [animation-duration:4s] shadow-lg shadow-pink-300/50"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-80 animate-ping [animation-delay:2s] [animation-duration:3.5s] shadow-lg shadow-blue-300/50"></div>
            <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-ping [animation-delay:4s] [animation-duration:2.8s] shadow-lg shadow-purple-300/50"></div>
            
            {/* Subtle grid pattern with depth */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            {/* Floating text elements as easter eggs */}
            <div className="absolute top-1/4 right-1/6 opacity-20 text-6xl font-thin text-blue-500/30 animate-float [animation-delay:3s] [animation-duration:12s] select-none pointer-events-none">
              Deutsch
            </div>
            <div className="absolute bottom-1/3 left-1/8 opacity-15 text-4xl font-thin text-purple-500/30 animate-float [animation-delay:6s] [animation-duration:15s] select-none pointer-events-none rotate-12">
              Guten Tag
            </div>
          </div>

          {/* Content centered */}
          <div className="text-center max-w-4xl mx-auto relative z-10">
            {/* Main heading with enhanced animations */}
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 animate-fade-in-up">
              <span className="text-gray-900 dark:text-white block animate-fade-in-up [animation-delay:0.2s]">Willkommen bei</span>
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text relative animate-fade-in-up [animation-delay:0.4s] bg-[length:200%_auto] animate-gradient-x">
                Deutsch.vn
                {/* Enhanced underline decoration with glow */}
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-lg shadow-purple-500/50 animate-glow"></div>
              </span>
            </h1>
            
            {/* Description with subtle animation */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-up [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
              Nền tảng học tiếng Đức toàn diện dành riêng cho người Việt Nam. 
              Từ cơ bản đến nâng cao, chúng tôi đồng hành cùng bạn trên hành trình chinh phục tiếng Đức.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tại sao chọn Deutsch.vn?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi cung cấp phương pháp học hiệu quả và phù hợp với người Việt Nam
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Chất lượng đảm bảo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nội dung được biên soạn bởi đội ngũ giáo viên có kinh nghiệm và được cập nhật thường xuyên
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Học nhanh hiệu quả</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Phương pháp học tập được tối ưu hóa giúp bạn tiến bộ nhanh chóng và ghi nhớ lâu dài
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Cộng đồng hỗ trợ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tham gia cộng đồng học viên năng động, cùng nhau chia sẻ kinh nghiệm và động lực học tập
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vocabulary Preview Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Khám phá kho từ vựng phong phú
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hàng ngàn từ vựng được phân loại theo chủ đề, kèm phát âm và ví dụ thực tế
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Gia đình & Người thân', count: '150+ từ', icon: '👨‍👩‍👧‍👦' },
                { title: 'Thực phẩm & Đồ uống', count: '200+ từ', icon: '🍽️' },
                { title: 'Giao thông & Du lịch', count: '180+ từ', icon: '🚗' },
                { title: 'Công việc & Học tập', count: '220+ từ', icon: '💼' },
              ].map((topic, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="text-4xl mb-2">{topic.icon}</div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription>{topic.count}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/vocabulary">Xem tất cả từ vựng</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Learning Path Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Lộ trình học tập rõ ràng
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Từ A1 đến C2, mỗi cấp độ được thiết kế chi tiết để bạn tiến bộ từng bước
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    level: 'A1-A2',
                    title: 'Cơ bản',
                    description: 'Làm quen với tiếng Đức, học từ vựng và ngữ pháp cơ bản',
                    features: ['Bảng chữ cái và phát âm', 'Từ vựng hàng ngày', 'Ngữ pháp cơ bản'],
                    color: 'bg-green-100 text-green-800 border-green-200'
                  },
                  {
                    level: 'B1-B2',
                    title: 'Trung cấp',
                    description: 'Phát triển khả năng giao tiếp và hiểu văn bản phức tạp hơn',
                    features: ['Giao tiếp tự nhiên', 'Đọc hiểu nâng cao', 'Viết đoạn văn'],
                    color: 'bg-blue-100 text-blue-800 border-blue-200'
                  },
                  {
                    level: 'C1-C2',
                    title: 'Nâng cao',
                    description: 'Thành thạo tiếng Đức như người bản ngữ',
                    features: ['Thảo luận chuyên sâu', 'Viết luận văn', 'Hiểu văn học'],
                    color: 'bg-purple-100 text-purple-800 border-purple-200'
                  }
                ].map((path, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${path.color}`}>
                        {path.level}
                      </div>
                      <CardTitle>{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {path.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Học viên nói gì về chúng tôi
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hàng ngàn học viên đã thành công với Deutsch.vn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                    <div className="flex justify-center gap-1 mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

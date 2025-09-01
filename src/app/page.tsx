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
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                Willkommen bei Deutsch.vn!
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Nền tảng học tiếng Đức toàn diện dành riêng cho người Việt Nam. 
                Từ cơ bản đến nâng cao, chúng tôi đồng hành cùng bạn trên hành trình chinh phục tiếng Đức.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg px-8 py-6">
                  <Link href="/vocabulary">Bắt đầu học ngay</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                  <Link href="/docs">Khám phá tính năng</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <div className="text-6xl">🇩🇪</div>
              </div>
            </div>
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

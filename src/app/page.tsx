import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, Zap, Star, MapPin, Mail, Youtube, Instagram, Facebook } from 'lucide-react';
import { MainNav } from '@/components/main-nav';

const testimonials = [
  {
    name: 'Siêu nhân hồng',
    role: 'Thành viên kim cương',
    quote: 'Môi trường học tập ở đây thật tuyệt vời và đầy cảm hứng!',
  },
  {
    name: 'Siêu nhân đỏ',
    role: 'Thành viên bạc',
    quote: 'Nhờ có Deutsch.vn, mình đã tự tin hơn rất nhiều trên con đường chinh phục tiếng Đức.',
  },
  {
    name: 'Siêu nhân vàng',
    role: 'Người đi đường',
    quote: 'Cộng đồng đã giúp đỡ mình rất nhiều, từ kiến thức đến kinh nghiệm thực tế.',
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
              <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground mb-8">
                Cùng nhau xây dựng một cộng đồng học tiếng Đức cởi mở, thân thiện và hiệu quả cho người Việt.
              </p>
              <Button size="lg" className="rounded-full px-10 py-6 text-lg font-bold" asChild>
                <Link href="/docs/introduction">Vào học</Link>
              </Button>
              <div className="flex justify-center md:justify-start gap-6 mt-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Miễn phí</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Minh bạch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Hiệu quả</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Image 
                src="https://placehold.co/400x400.png"
                alt="Person reading on a stack of books"
                width={400}
                height={400}
                data-ai-hint="illustration reading"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight">
                  Nơi mỗi người học đều được lắng nghe và tôn trọng.
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Hành trình học một ngôn ngữ mới luôn có những thử thách. Thấu hiểu điều đó, Deutsch.vn ra đời với mong muốn tạo ra một không gian học tập an toàn và đáng tin cậy.</p>
                <p>Đây là nơi chúng ta cùng nhau chia sẻ kiến thức, kinh nghiệm và hỗ trợ lẫn nhau trên con đường chinh phục tiếng Đức.</p>
                <p>Chúng tôi tin rằng sự minh bạch và tinh thần cộng đồng sẽ là nền tảng vững chắc nhất cho sự tiến bộ của mỗi cá nhân.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Lộ trình phát triển của chúng ta</h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Deutsch.vn hướng tới việc hỗ trợ toàn diện cho người học tiếng Đức qua 3 giai đoạn chính.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center shadow-none border rounded-2xl p-4">
                <CardHeader>
                  <div className="mx-auto w-20 h-20">
                     <Image src="https://placehold.co/80x80.png" alt="Xây dựng nền tảng học tập" width={80} height={80} data-ai-hint="illustration teamwork"/>
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Nền tảng học tập miễn phí</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Xây dựng hệ thống bài học chất lượng, có hệ thống và hoàn toàn miễn phí, giúp mọi người đều có cơ hội tiếp cận kiến thức một cách dễ dàng.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-none border rounded-2xl p-4">
                <CardHeader>
                  <div className="mx-auto w-20 h-20">
                    <Image src="https://placehold.co/80x80.png" alt="Xây dựng công cụ đánh giá" width={80} height={80} data-ai-hint="illustration community"/>
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Hệ thống đánh giá minh bạch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Phát triển một nền tảng review, nơi cộng đồng có thể chia sẻ và tham khảo những đánh giá chân thực về các dịch vụ liên quan đến tiếng Đức.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-none border rounded-2xl p-4">
                <CardHeader>
                  <div className="mx-auto w-20 h-20">
                    <Image src="https://placehold.co/80x80.png" alt="Người đi trước giúp người đi sau" width={80} height={80} data-ai-hint="illustration helping"/>
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Kết nối và sẻ chia kinh nghiệm</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Tạo dựng một không gian nơi những người đi trước có thể chia sẻ kinh nghiệm, cơ hội học tập và việc làm cho những người đi sau.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-none border rounded-2xl p-4">
                <CardHeader>
                  <div className="mx-auto w-20 h-20">
                     <Image src="https://placehold.co/80x80.png" alt="Du học an toàn" width={80} height={80} data-ai-hint="illustration shield"/>
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Hỗ trợ du học an toàn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Kết nối với các đơn vị uy tín, xây dựng một quy trình an toàn và minh bạch để hỗ trợ các bạn trên con đường du học và phát triển sự nghiệp.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
           <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <Image 
                src="https://placehold.co/400x300.png"
                alt="Hands building with blocks"
                width={400}
                height={300}
                data-ai-hint="illustration building blocks"
                className="object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-primary font-semibold mb-2">Deutsch.vn</p>
              <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Được xây dựng cho người học, bởi những người học.
              </h2>
              <p className="text-muted-foreground">Chúng tôi tin rằng sức mạnh lớn nhất đến từ cộng đồng. Deutsch.vn là một dự án mở, luôn chào đón sự chung tay xây dựng và những góp ý chân thành từ các bạn.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">Cộng đồng nói gì về Deutsch.vn...</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="text-left rounded-2xl p-6 shadow-sm border">
                  <CardHeader className="p-0">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <CardTitle className="text-lg font-bold">{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <p className="text-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-bold text-lg mb-2">Deutsch.VN</h3>
                <p className="text-muted-foreground mb-4">Cùng nhau xây dựng một cộng đồng học tiếng Đức cởi mở, thân thiện và hiệu quả cho người Việt.</p>
                <div className="flex gap-4">
                  <Link href="#"><Facebook className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
                  <Link href="#"><Instagram className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
                  <Link href="#"><Youtube className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Liên hệ</h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1 shrink-0"/><span>Tp. Hồ Chí Minh, Việt Nam</span></li>
                  <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-1 shrink-0" /><span>deutschvn.info@gmail.com</span></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Thông tin</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-muted-foreground hover:text-primary">Moodle</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-primary">Dự án</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-primary">Lộ trình</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-primary">Đội nhóm</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-primary">Liên hệ</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-primary">Theme 1</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Partner</h4>
                <ul className="space-y-3">
                   <li><Link href="#" className="text-muted-foreground hover:text-primary">Deutsche Ecke</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>Copyright © {new Date().getFullYear()} Deutsch.vn</p>
            </div>
        </div>
      </footer>
    </div>
  );
}

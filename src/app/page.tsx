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
    quote: 'Đội ngũ mọi người sử dụng rất ý xì!',
  },
  {
    name: 'Siêu nhân đỏ',
    role: 'Thành viên bạc',
    quote: 'Nhờ góp ý một cách rất thật như hifif.',
  },
  {
    name: 'Siêu nhân vàng',
    role: 'Người đi đường',
    quote: 'Chắc mai mốt phải góp ý Ids cho khoa Módal',
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
                Chúng mình ở đây, với mong muốn có thể xây một cộng đồng tiếng Đức lành mạnh và an toàn.
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
                  <span>An toàn</span>
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
                  Tại đây, chúng ta tạo nên tiếng nói của chính mình!
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Mình đã từng là một học sinh, mong muốn kiếm được một nơi an toàn để học tiếng Đức uy tín. Mình cũng đã từng trải qua việc làm hồ sơ tại Việt Nam, không uy tín. Mình đã từng phải ngậm ngùi chịu qua và không thể làm gì hơn.</p>
                <p>Đó là lý do chúng ta ở đây, tạo nên cộng đồng của chính mình!</p>
                <p>Nơi mà bạn có quyền đánh giá các đơn vị cung cấp dịch vụ tiếng Đức một cách thẳng thắn và minh bạch.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Bạn mình sẽ làm những gì?</h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Mục tiêu lớn nhất của Team là có thể giúp các bạn học tiếng Đức một cách thuận lợi nhất! Deutsch.vn có 3 giai đoạn.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center shadow-none border rounded-2xl p-4">
                <CardHeader>
                  <div className="mx-auto w-20 h-20">
                     <Image src="https://placehold.co/80x80.png" alt="Xây dựng nền tảng học tập" width={80} height={80} data-ai-hint="illustration teamwork"/>
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Xây dựng nền tảng học tập</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Sẽ bao gồm xây dựng các bài học theo một cách có hệ thống, cùng các bạn có thể học một cách hoàn toàn miễn phí. Chắc chắn hai bàn tay trắng là những thế hệ ưu tú!</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-none border rounded-2xl p-4">
                <CardHeader>
                  <div className="mx-auto w-20 h-20">
                    <Image src="https://placehold.co/80x80.png" alt="Xây dựng công cụ đánh giá" width={80} height={80} data-ai-hint="illustration community"/>
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Xây dựng công cụ đánh giá</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Sẽ phát triển hệ thống review, nơi các bạn có thể đưa ra đánh giá minh bạch, công cụ sẽ phát triển dựa trên học tập trung cái thiện và lộ trình cụ thể.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-none border rounded-2xl p-4">
                <CardHeader>
                  <div className="mx-auto w-20 h-20">
                    <Image src="https://placehold.co/80x80.png" alt="Người đi trước giúp người đi sau" width={80} height={80} data-ai-hint="illustration helping"/>
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Người đi trước giúp người đi sau</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Bọn mình sẽ xây dựng một nền tảng Job, nơi mà các bạn có thể tìm thấy Internship và giúp đỡ các bạn đi sau.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-none border rounded-2xl p-4">
                <CardHeader>
                  <div className="mx-auto w-20 h-20">
                     <Image src="https://placehold.co/80x80.png" alt="Du học an toàn" width={80} height={80} data-ai-hint="illustration shield"/>
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Du học an toàn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Bọn mình sẽ kết nối với những đơn vị uy tín, có giấy phép và xây dựng một quy trình an toàn thông qua các tiêu chí của mình. Sẽ bảo vệ quyền lợi 2 bên.</p>
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
              <p className="text-muted-foreground">Bọn mình cố gắng xây dựng trang web như một dự án mở. Mở để các bạn cùng xây dựng và cởi mở nhận góp ý của các bạn.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">Học viên cũ nói gì về chúng tôi...</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8 text-sm">
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-bold text-lg mb-2">Deutsch.VN</h3>
                <p className="text-muted-foreground mb-4">Chúng mình ở đây, với mong muốn có thể xây một cộng đồng tiếng Đức lành mạnh và an toàn.</p>
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

               <div>
                <h4 className="font-semibold mb-4">Donate</h4>
                <ul className="space-y-3">
                   <li><Link href="#" className="text-muted-foreground hover:text-primary">Deutsch.vn</Link></li>
                   <li><Link href="#" className="text-muted-foreground hover:text-primary">Nam Vu</Link></li>
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

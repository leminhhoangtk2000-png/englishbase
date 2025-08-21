import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const levels = [
  {
    name: 'A1 Niveau',
    description: 'Bắt đầu hành trình của bạn với những kiến thức cơ bản nhất. Học cách giới thiệu bản thân, chào hỏi và các mẫu câu giao tiếp đơn giản hàng ngày.',
    href: '/exercises/a1',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'beginner language',
  },
  {
    name: 'A2 Niveau',
    description: 'Xây dựng nền tảng vững chắc hơn. Bạn sẽ học cách mô tả về gia đình, công việc, và môi trường xung quanh một cách chi tiết hơn.',
    href: '/exercises/a2',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'building blocks',
  },
  {
    name: 'B1 Niveau',
    description: 'Tự tin hơn trong giao tiếp. Ở cấp độ này, bạn có thể xử lý hầu hết các tình huống khi đi du lịch, thảo luận về các chủ đề quen thuộc và bày tỏ ý kiến cá nhân.',
    href: '/exercises/b1',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'confident conversation',
  },
  {
    name: 'B2 Niveau',
    description: 'Làm chủ ngôn ngữ. Bạn có thể hiểu các văn bản phức tạp, thảo luận về các vấn đề chuyên môn và giao tiếp một cách tự nhiên, trôi chảy.',
    href: '/exercises/b2',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'language mastery',
  },
];

export function ExercisesLandingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">
          Luyện tập theo trình độ
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Chọn trình độ của bạn để bắt đầu làm các bài tập củng cố kiến thức và kỹ năng.
        </p>
      </div>

      <div className="space-y-16">
        {levels.map((level, index) => (
          <React.Fragment key={level.name}>
            <div
              className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
            >
              <div className={`p-8 md:p-12 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                <h2 className="text-3xl font-bold font-headline mb-4">{level.name}</h2>
                <p className="text-muted-foreground mb-6 text-lg">{level.description}</p>
                <Button asChild size="lg">
                  <Link href={level.href}>
                    Bắt đầu luyện tập <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className={`relative h-80 md:h-96 rounded-lg overflow-hidden ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <Image
                  src={level.image}
                  alt={`Hình ảnh minh họa cho ${level.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  data-ai-hint={level.data_ai_hint}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
            {index < levels.length - 1 && <Separator className="my-8" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

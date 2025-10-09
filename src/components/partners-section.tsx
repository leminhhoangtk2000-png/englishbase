'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  description?: string;
}

const partners: Partner[] = [
  {
    id: 'deutschhub',
    name: 'DeutschHub',
    logo: '/partner/deutschhub.png',
    website: 'https://deutschhub.vn/',
    description: 'DeutschHub - Trung tâm học tiếng Đức'
  },
  {
    id: 'dek', 
    name: 'DEK',
    logo: '/partner/dek.png',
    website: 'https://dek.edu.vn/',
    description: 'DEK - Đối tác giáo dục'
  }
];

export default function PartnersSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Đối tác của chúng tôi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi tự hào hợp tác với các tổ chức giáo dục và văn hóa hàng đầu của Đức
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {partners.map((partner) => (
            <div key={partner.id} className="group">
              <Card className="p-8 h-40 flex items-center justify-center bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20 cursor-pointer"
                onClick={() => window.open(partner.website, '_blank')}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={250}
                    height={120}
                    className="object-contain max-w-full max-h-full transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/250x120/3b82f6/ffffff?text=${encodeURIComponent(partner.name)}`;
                    }}
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Bạn quan tâm đến việc hợp tác? {' '}
            <Link 
              href="/contact" 
              className="text-primary hover:underline font-medium"
            >
              Liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

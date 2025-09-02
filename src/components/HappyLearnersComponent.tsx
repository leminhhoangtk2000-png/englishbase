'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Our Happy Learners component
export function HappyLearnersComponent() {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch('/api/reviews?limit=6');
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        } else {
          // Fallback data for demo
          const fallbackReviews = generateFallbackReviews();
          setReviews(fallbackReviews.slice(0, 6));
        }
      } catch (error) {
        const fallbackReviews = generateFallbackReviews();
        setReviews(fallbackReviews.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Happy Learners
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Những câu chuyện thành công từ cộng đồng học viên của chúng tôi
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-2xl mx-auto">
          {reviews.map((review, index) => (
            <TestimonialCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            asChild 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/user">
              ✨ Tham gia cộng đồng
            </Link>
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Cùng hàng ngàn học viên khác trên hành trình học tiếng Đức
          </p>
        </div>
      </div>
    </section>
  );
}

// Individual testimonial card component
function TestimonialCard({ review, index }: { review: any; index: number }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 shadow-md bg-white dark:bg-gray-800">
      <CardContent className="p-3">
        {/* Rating and Actions */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span className="text-xs">{Math.floor(Math.random() * 50) + 10}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span className="text-xs">{Math.floor(Math.random() * 20) + 5}</span>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <p className="text-gray-700 dark:text-gray-300 text-xs leading-tight mb-2 line-clamp-2">
          "{review.comment}"
        </p>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage 
              src={review.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.name || index}`} 
              alt={review.user?.name || 'User'} 
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold text-xs">
              {review.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white text-xs">
              {review.user?.name || 'Học viên'}
            </p>
            <p className="text-xs text-gray-500">
              @{review.user?.username || review.user?.name?.toLowerCase().replace(' ', '') || 'user'}
            </p>
          </div>
        </div>

        {/* Social Platform Badge */}
        <div className="mt-1 flex justify-end">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white flex items-center justify-center">
            <span className="text-xs font-bold">D</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Generate fallback reviews for demo
function generateFallbackReviews() {
  const names = [
    'Kiệt Võ', 'Premium User', 'Admin User', 'Anna Schmidt', 'Peter Mueller', 'Lisa Weber'
  ];
  
  const comments = [
    'Eine wunderbare Ergänzung zu meinem Deutschkurs. Die Vokabeln sind sehr praktisch und alltagsnah.',
    'Cảm ơn đội ngũ phát triển! Đây chính xác là những gì tôi cần để cải thiện tiếng Đức.',
    'Perfekt für das Selbststudium! Die Erklärungen sind klar und die Beispiele sehr hilfreich.',
    'Ứng dụng giúp tôi học từ vựng một cách có hệ thống. Rất thích phần phát âm và ví dụ câu.',
    'Sehr empfehlenswert für alle Vietnamesen, die Deutsch lernen wollen. Gut durchdacht und professionell.',
    'Giao diện đẹp, nội dung chất lượng. Đặc biệt thích phần luyện tập từ vựng theo chủ đề.'
  ];

  const userTypes = ['regular_user', 'premium_user', 'admin'];

  return names.map((name, index) => ({
    id: `fallback-${index}`,
    user: {
      name,
      username: name.toLowerCase().replace(' ', '_'),
      avatar: null,
      role: userTypes[index % userTypes.length]
    },
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    comment: comments[index],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
  }));
}

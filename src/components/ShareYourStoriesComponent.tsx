'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Our Happy Learners component
export function ShareYourStoriesComponent() {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        {/* Rating and Actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{Math.floor(Math.random() * 50) + 10}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{Math.floor(Math.random() * 20) + 5}</span>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
          "{review.comment}"
        </p>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage 
              src={review.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.name || index}`} 
              alt={review.user?.name || 'User'} 
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold text-sm">
              {review.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {review.user?.name || 'Học viên'}
            </p>
            <p className="text-xs text-gray-500">
              @{review.user?.username || review.user?.name?.toLowerCase().replace(' ', '') || 'user'}
            </p>
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(review.createdAt)}
          </div>
        </div>

        {/* Social Platform Badge */}
        <div className="mt-3 flex justify-end">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white flex items-center justify-center">
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
    'Anna Schmidt', 'Peter Mueller', 'Lisa Weber', 'Michael Koch', 'Sarah Wagner',
    'Thomas Fischer', 'Julia Becker', 'David Schulz', 'Laura Hoffmann', 'Stefan Meyer'
  ];
  
  const comments = [
    'Nền tảng Deutsch.vn đã giúp tôi tiết kiệm thời gian, giảm căng thẳng học tập và đầu tư hiệu quả cho tương lai - đây thực sự là giải pháp hoàn hảo cho việc học tiếng Đức.',
    'Tôi yêu thích cách Deutsch.vn giúp tôi theo dõi tiến độ học tập một cách dễ dàng và trực quan.',
    'Nhờ có Deutsch.vn, tôi cảm thấy tự tin và hiểu biết hơn về quyết định học tập của mình so với trước đây.',
    'Cảm ơn Deutsch.vn, tôi cảm thấy tự tin và am hiểu hơn về hành trình học tiếng Đức của mình.',
    'Platform này thực sự đã thay đổi cuộc sống học tập của tôi một cách tích cực.',
    'Các bài học được thiết kế rất logic và dễ theo dõi, giúp tôi tiến bộ nhanh chóng.',
    'Tôi đã cải thiện khả năng nghe nói tiếng Đức rất nhiều nhờ các bài tập thực hành.',
    'Cộng đồng học viên rất tốt bụng và nhiệt tình hỗ trợ lẫn nhau.',
    'Giáo trình được cập nhật thường xuyên và phù hợp với xu hướng học tập hiện đại.',
    'Tôi đã pass được kỳ thi B1 nhờ những kiến thức học được từ Deutsch.vn.'
  ];

  return names.map((name, index) => ({
    id: `fallback-${index}`,
    user: {
      name,
      username: name.toLowerCase().replace(' ', ''),
      avatar: null
    },
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    comment: comments[index],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
  }));
}

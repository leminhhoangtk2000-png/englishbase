'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Shield, Zap, Star, Users, Check, Quote } from 'lucide-react';
import { MainNav } from '@/components/main-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';

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

// Happy Learners Component
function HappyLearnersComponent() {
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedReview, setSelectedReview] = React.useState(null);
  const [visibleReviews, setVisibleReviews] = React.useState([]);
  const [showStats, setShowStats] = React.useState(false);

  React.useEffect(() => {
    const loadReviews = async () => {
      try {
        console.log('🚀 Starting to load reviews...');
        const response = await fetch('/api/reviews?limit=12');
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Loaded reviews:', data.reviews);
          console.log('📊 Review count:', data.reviews?.length || 0);
          setReviews(data.reviews || []);
          
          // Show stats after data loads
          setTimeout(() => setShowStats(true), 500);
          
          // FOR DEBUGGING: Show all reviews immediately without animation
          if (data.reviews && data.reviews.length > 0) {
            console.log('🎬 Starting animation for', data.reviews.length, 'reviews');
            setVisibleReviews(data.reviews); // Show all immediately
            console.log('👥 Visible reviews set to:', data.reviews.length);
          } else {
            console.log('⚠️ No reviews to animate');
          }
        } else {
          console.error('❌ API response not ok:', response.status, await response.text());
          // Use fallback data if API fails
          const fallbackReviews = [
            {
              id: 'fallback-1',
              user: { name: 'Anna Schmidt', avatar: null },
              rating: 5,
              comment: 'Tuyệt vời! Tôi đã học được rất nhiều từ vựng tiếng Đức mới. Giao diện rất thân thiện và dễ sử dụng.',
              createdAt: new Date().toISOString()
            },
            {
              id: 'fallback-2', 
              user: { name: 'Peter Mueller', avatar: null },
              rating: 4,
              comment: 'Die beste App zum Deutschlernen! Sehr systematisch und gut strukturiert.',
              createdAt: new Date().toISOString()
            }
          ];
          setReviews(fallbackReviews);
          // Show fallback immediately
          setVisibleReviews(fallbackReviews);
          setTimeout(() => setShowStats(true), 500);
        }
      } catch (error) {
        console.error('💥 Error loading reviews:', error);
        // Use fallback data on error
        const errorFallbackReviews = [
          {
            id: 'error-fallback-1',
            user: { name: 'Test User', avatar: null },
            rating: 5,
            comment: 'This is test data shown when API fails to load.',
            createdAt: new Date().toISOString()
          }
        ];
        setReviews(errorFallbackReviews);
        // Show error fallback immediately
        setVisibleReviews(errorFallbackReviews);
        setTimeout(() => setShowStats(true), 500);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Stats skeleton */}
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
        </div>

        {/* Avatar grid skeleton */}
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="relative">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Users className="w-16 h-16 mx-auto text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Chưa có đánh giá nào</h3>
        <p className="text-muted-foreground mb-6">Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
        <Button asChild>
          <Link href="/login">Đăng nhập để đánh giá</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Stats Section */}
      <div className={`text-center transition-all duration-1000 ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-3 rounded-full border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-lg">{averageRating}</span>
          </div>
          <div className="w-px h-6 bg-purple-300"></div>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold">{reviews.length}</span> đánh giá
          </div>
        </div>
      </div>

      {/* DEBUG: Show simple list of reviews */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h3 className="text-lg font-semibold text-center">🧪 DEBUG: Reviews List ({visibleReviews.length})</h3>
        {visibleReviews.map((review: any, index: number) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {review.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold">{review.user?.name || 'Unknown User'}</p>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{review.comment}</p>
            <small className="text-gray-500 text-xs mt-2 block">
              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
            </small>
          </div>
        ))}
      </div>

      {/* Original Interactive Avatar Grid - Hidden for now */}
      <div className="hidden relative">
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto min-h-[200px]">
          {visibleReviews.map((review: any, index: number) => (
            <UserAvatar
              key={review.id}
              review={review}
              index={index}
              isSelected={selectedReview?.id === review.id}
              onClick={() => setSelectedReview(selectedReview?.id === review.id ? null : review)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// User Avatar Component with Animation
function UserAvatar({ review, index, isSelected, onClick }: {
  review: any;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [showStars, setShowStars] = React.useState(true);

  React.useEffect(() => {
    // Hide stars after 3 seconds of appearing
    const timer = setTimeout(() => {
      setShowStars(false);
    }, 3000 + index * 200);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 transform ${
        isSelected ? 'scale-125 z-20' : 'hover:scale-110 hover:z-10'
      }`}
      onClick={onClick}
      style={{
        animationDelay: `${index * 200}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {/* Star Rating Overlay - Shows initially then fades */}
      <div className={`absolute -top-2 -right-2 transition-all duration-700 ${
        showStars ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
      }`}>
        <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3 fill-current" />
          {review.rating}
        </div>
      </div>

      {/* Avatar */}
      <div className={`relative transition-all duration-300 ${
        isSelected 
          ? 'ring-4 ring-purple-400 shadow-xl' 
          : 'ring-2 ring-transparent group-hover:ring-purple-300 group-hover:shadow-lg'
      }`}>
        <Avatar className={`transition-all duration-300 ${isSelected ? 'w-20 h-20' : 'w-16 h-16'}`}>
          <AvatarImage 
            src={review.user.avatar || "https://placehold.co/64x64.png"} 
            alt={review.user.name || review.user.username}
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold">
            {review.user.name?.charAt(0) || review.user.username?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Expanded Review Tooltip - Shows when selected */}
      {isSelected && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-30 animate-in zoom-in-95 duration-300">
          <Card className="w-80 shadow-xl border-purple-200 dark:border-purple-800 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg font-bold">
                {review.user.name || review.user.username || 'Học viên'}
              </CardTitle>
              <CardDescription className="text-sm">Thành viên</CardDescription>
              
              {/* Rating Stars */}
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Comment */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-3 rounded-lg mb-3">
                <Quote className="w-4 h-4 text-purple-400 mx-auto mb-2" />
                <p className="text-sm italic leading-relaxed text-center">
                  "{review.comment}"
                </p>
              </div>
              
              {/* Date */}
              <p className="text-xs text-muted-foreground text-center">
                Đánh giá vào {new Date(review.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </CardContent>

            {/* Arrow pointer */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-white dark:bg-gray-900 border-l border-t border-purple-200 dark:border-purple-800 rotate-45"></div>
            </div>
          </Card>
        </div>
      )}

      {/* Simple hover tooltip - Shows when NOT selected */}
      {!isSelected && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {review.user.name || review.user.username || 'Học viên'}
          </div>
        </div>
      )}
    </div>
  );
}

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
                <Link href="/a1niveau/introduction">Vào học</Link>
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

        {/* Happy Learners Section */}
        <section className="bg-secondary/50 py-20 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Floating hearts */}
            <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
              <div className="w-8 h-8 text-pink-300 opacity-40">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
              <div className="w-6 h-6 text-blue-300 opacity-40">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            
            {/* Floating stars */}
            <div className="absolute top-32 left-1/4 animate-pulse" style={{ animationDelay: '2s' }}>
              <Star className="w-5 h-5 text-yellow-300 opacity-50 fill-current" />
            </div>
            <div className="absolute bottom-32 right-1/4 animate-pulse" style={{ animationDelay: '3s' }}>
              <Star className="w-4 h-4 text-purple-300 opacity-40 fill-current" />
            </div>
            
            {/* Geometric shapes */}
            <div className="absolute top-1/4 left-1/3 opacity-20">
              <div className="w-16 h-16 border-2 border-purple-300 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
            </div>
            <div className="absolute bottom-1/4 right-1/3 opacity-15">
              <div className="w-20 h-20 border-2 border-blue-300 rounded-lg rotate-45 animate-pulse"></div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Beautiful Header with enhanced decorations */}
            <div className="mb-16">
              <p className="text-muted-foreground mb-6 text-sm tracking-wide uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Public opinion suggests
              </p>
              
              <div className="flex items-center justify-center gap-8 mb-8">
                {/* Left decoration */}
                <div className="hidden md:block animate-in slide-in-from-left duration-1000 delay-500">
                  <div className="relative">
                    <svg width="80" height="60" viewBox="0 0 80 60" className="text-purple-400">
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor:"rgb(168, 85, 247)", stopOpacity:0.6}} />
                          <stop offset="100%" style={{stopColor:"rgb(59, 130, 246)", stopOpacity:0.3}} />
                        </linearGradient>
                      </defs>
                      {/* Wheat/laurel pattern */}
                      <path d="M10 30 Q15 20, 20 30 Q25 40, 30 30 Q35 20, 40 30 Q45 40, 50 30 Q55 20, 60 30 Q65 40, 70 30" 
                            stroke="url(#grad1)" strokeWidth="3" fill="none"/>
                      <path d="M15 25 Q20 15, 25 25 Q30 35, 35 25 Q40 15, 45 25 Q50 35, 55 25 Q60 15, 65 25" 
                            stroke="url(#grad1)" strokeWidth="2" fill="none" opacity="0.7"/>
                      <path d="M20 35 Q25 25, 30 35 Q35 45, 40 35 Q45 25, 50 35 Q55 45, 60 35" 
                            stroke="url(#grad1)" strokeWidth="2" fill="none" opacity="0.7"/>
                    </svg>
                  </div>
                </div>
                
                {/* Main title */}
                <div className="text-center animate-in zoom-in duration-1000 delay-300">
                  <h2 className="font-headline text-5xl md:text-7xl font-bold mb-3">
                    <span className="text-foreground">Our Happy</span>{" "}
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                      Learners
                    </span>
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                    <span>See how our learners are talking about us</span>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                  </div>
                </div>
                
                {/* Right decoration */}
                <div className="hidden md:block animate-in slide-in-from-right duration-1000 delay-500">
                  <div className="relative">
                    <svg width="80" height="60" viewBox="0 0 80 60" className="text-purple-400 scale-x-[-1]">
                      <defs>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor:"rgb(59, 130, 246)", stopOpacity:0.6}} />
                          <stop offset="100%" style={{stopColor:"rgb(168, 85, 247)", stopOpacity:0.3}} />
                        </linearGradient>
                      </defs>
                      {/* Wheat/laurel pattern */}
                      <path d="M10 30 Q15 20, 20 30 Q25 40, 30 30 Q35 20, 40 30 Q45 40, 50 30 Q55 20, 60 30 Q65 40, 70 30" 
                            stroke="url(#grad2)" strokeWidth="3" fill="none"/>
                      <path d="M15 25 Q20 15, 25 25 Q30 35, 35 25 Q40 15, 45 25 Q50 35, 55 25 Q60 15, 65 25" 
                            stroke="url(#grad2)" strokeWidth="2" fill="none" opacity="0.7"/>
                      <path d="M20 35 Q25 25, 30 35 Q35 45, 40 35 Q45 25, 50 35 Q55 45, 60 35" 
                            stroke="url(#grad2)" strokeWidth="2" fill="none" opacity="0.7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <HappyLearnersComponent />
          </div>
        </section>

      </main>
    </div>
  );
}

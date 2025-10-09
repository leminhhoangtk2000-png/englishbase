'use client';

import { MainNav } from '@/components/main-nav';
import PartnersSection from '@/components/partners-section';

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
                Deutsch.vn!
                {/* Enhanced underline decoration with glow */}
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-lg shadow-purple-500/50 animate-glow"></div>
              </span>
            </h1>
            
            {/* Description with subtle animation */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-up [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards] mb-12">
              Chúng mình ở đây, với mong muốn có thể xây một cộng đồng tiếng Đức lành mạnh và an toàn.
            </p>

            {/* Features */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 animate-fade-in-up [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
              <div className="flex flex-col items-center gap-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">Miễn phí</span>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">An toàn</span>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">Hiệu quả</span>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection />
      </main>
    </div>
  );
}

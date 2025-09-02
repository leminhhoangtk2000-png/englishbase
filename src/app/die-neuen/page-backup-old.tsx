'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/main-nav';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  content: string;
  excerpt: string;
  source: string;
  publishedAt: string | null;
  wordCount: number;
  isHot: boolean;
  hotScore: number | null;
  aiAnalysis: string | null;
  createdAt: string;
  difficulty?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  vietnameseAnalysis?: string;
}

// Mockup data với ảnh
const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Deutschland und die europäische Sicherheit nach der Ukraine-Krise',
    excerpt: 'Die deutsche Außenpolitik steht vor neuen Herausforderungen in einer sich verändernden Sicherheitslandschaft. Experten diskutieren über die Rolle Deutschlands in der europäischen Verteidigung.',
    content: 'Full article content...',
    imageUrl: '/images/shared/german-politics.jpg',
    author: {
      name: 'Anders Fogh Rasmussen',
      avatar: '/images/shared/author1.jpg'
    },
    category: 'Politik',
    publishedAt: '2025-02-09T10:00:00Z',
    url: '#',
    isHot: true
  },
  {
    id: '2',
    title: 'KI in der deutschen Arbeitswelt: Chancen und Risiken',
    excerpt: 'Künstliche Intelligenz verändert die Art, wie wir arbeiten. Deutsche Unternehmen stehen vor der Herausforderung, Innovation und Arbeitsplätze in Einklang zu bringen.',
    content: 'Full article content...',
    imageUrl: '/images/shared/ai-technology.jpg',
    author: {
      name: 'Sarah O\'Connor',
      avatar: '/images/shared/author2.jpg'
    },
    category: 'Technologie',
    publishedAt: '2025-02-09T09:30:00Z',
    url: '#',
    isOpinion: true
  },
  {
    id: '3',
    title: 'Deutsche Wirtschaft: Neue Wege in der Globalisierung',
    excerpt: 'Nach den Herausforderungen der letzten Jahre sucht die deutsche Wirtschaft neue Ansätze für internationalen Handel und Zusammenarbeit.',
    content: 'Full article content...',
    author: {
      name: 'Stephen Bush',
      avatar: '/images/shared/author3.jpg'
    },
    category: 'Wirtschaft',
    publishedAt: '2025-02-09T08:45:00Z',
    url: '#',
    isOpinion: true
  },
  {
    id: '4',
    title: 'Klimawandel und deutsche Energiepolitik',
    excerpt: 'Deutschland setzt neue Maßstäbe in der Energiewende. Expertenanalyse der aktuellen Entwicklungen und zukünftigen Herausforderungen.',
    content: 'Full article content...',
    author: {
      name: 'Gideon Rachman',
      avatar: '/images/shared/author4.jpg'
    },
    category: 'Umwelt',
    publishedAt: '2025-02-09T08:00:00Z',
    url: '#',
    isOpinion: true
  },
  {
    id: '5',
    title: 'Bildungssystem: Digitale Transformation in deutschen Schulen',
    excerpt: 'Die Digitalisierung des Bildungswesens schreitet voran. Ein Blick auf erfolgreiche Projekte und noch zu bewältigende Herausforderungen.',
    content: 'Full article content...',
    author: {
      name: 'Patti Waldmeir',
      avatar: '/images/shared/author5.jpg'
    },
    category: 'Bildung',
    publishedAt: '2025-02-09T07:30:00Z',
    url: '#'
  },
  {
    id: '6',
    title: 'Deutsche Startups: Innovation im internationalen Vergleich',
    excerpt: 'Wie behaupten sich deutsche Technologie-Startups im globalen Wettbewerb? Eine Analyse der Stärken und Schwächen.',
    content: 'Full article content...',
    author: {
      name: 'Luke McDonagh',
      avatar: '/images/shared/author6.jpg'
    },
    category: 'Business',
    publishedAt: '2025-02-09T07:00:00Z',
    url: '#'
  }
];

const sidebarLinks = [
  'The FT View',
  'Lex',
  'Unhedged', 
  'Markets Insight',
  'Inside Business'
];

export default function DieNeuen() {
  const [articles] = useState<NewsArticle[]>(mockArticles);
  
  const featuredArticle = articles.find(a => a.isHot) || articles[0];
  const opinionArticles = articles.filter(a => a.isOpinion);
  const regularArticles = articles.filter(a => !a.isHot && !a.isOpinion);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Featured Article - Large Header */}
        <div className="mb-12">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-gradient-to-r from-slate-900 to-slate-700">
            {featuredArticle.imageUrl && (
              <Image
                src="/images/shared/german-parliament.jpg"
                alt={featuredArticle.title}
                fill
                className="object-cover opacity-80"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-4xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded">
                    {featuredArticle.category}
                  </span>
                  <span className="text-sm opacity-90">
                    {formatDate(featuredArticle.publishedAt)} • {formatTime(featuredArticle.publishedAt)}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {featuredArticle.title}
                </h1>
                
                <p className="text-lg opacity-90 mb-6 max-w-3xl leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/shared/default-avatar.jpg"
                    alt={featuredArticle.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium">{featuredArticle.author.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Opinion Section */}
          <div className="lg:col-span-3">
            {/* Opinion Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">OPINION</h2>
              <div className="w-16 h-1 bg-blue-600"></div>
            </div>

            {/* Opinion Articles Grid */}
            <div className="grid gap-8 mb-12">
              {opinionArticles.map((article, index) => (
                <article key={article.id} className="group cursor-pointer">
                  <div className="flex gap-6">
                    {/* Quote Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <span className="text-3xl text-blue-600 font-serif leading-none">"</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <Image
                          src="/images/shared/default-avatar.jpg"
                          alt={article.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="font-medium text-gray-900">{article.author.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {index < opinionArticles.length - 1 && (
                    <div className="border-b border-gray-200 mt-8"></div>
                  )}
                </article>
              ))}
            </div>

            {/* Regular Articles */}
            <div className="grid gap-6">
              {regularArticles.map((article) => (
                <article key={article.id} className="group cursor-pointer border-b border-gray-100 pb-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-2xl text-blue-600 font-serif">"</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Image
                          src="/images/shared/default-avatar.jpg"
                          alt={article.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{article.author.name}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">More Opinion</h3>
              
              <div className="space-y-3">
                {sidebarLinks.map((link, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="block text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>

              {/* Featured Opinion Preview */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Featured Analysis</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  In-depth analysis of current German political and economic developments from our expert contributors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="text-sm text-gray-500">Mehr lesen:</span>
            {['Politik', 'Wirtschaft', 'Technologie', 'Kultur', 'Sport'].map((category) => (
              <Link
                key={category}
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

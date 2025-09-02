'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MainNav } from '@/components/main-nav';

// Sample blog post content
const samplePost = {
  title: 'Willkommen zu unserem Deutsch-Lern-Blog',
  content: `
    <p>Herzlich willkommen zu unserem Blog über das Deutschlernen! Hier finden Sie hilfreiche Artikel, Tipps und Geschichten rund um das Erlernen der deutschen Sprache.</p>
    
    <h2>Was Sie hier erwartet</h2>
    <p>Unser Blog bietet Ihnen:</p>
    <ul>
      <li>Praktische Grammatiktipps</li>
      <li>Wortschatz-Übungen</li>
      <li>Kulturelle Einblicke</li>
      <li>Persönliche Lernerfahrungen</li>
      <li>Moderne Lernmethoden</li>
    </ul>
    
    <h2>Für wen ist dieser Blog?</h2>
    <p>Egal ob Sie Anfänger sind oder Ihre Deutschkenntnisse verbessern möchten - hier finden alle Lernenden hilfreiche Inhalte.</p>
    
    <blockquote>
      <p>"Eine neue Sprache ist wie ein neues Fenster zur Welt."</p>
    </blockquote>
    
    <p>Viel Spaß beim Lesen und Lernen!</p>
  `,
  author: 'Das Edu-Theme Team',
  publishedAt: '2024-12-15T10:00:00Z',
  readTime: 3,
  category: 'Allgemein',
  image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop'
};

export default function BlogPostPageComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96 w-full">
            <Image
              src={samplePost.image}
              alt={samplePost.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge className="mb-3 bg-white/90 text-gray-800">
                {samplePost.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {samplePost.title}
              </h1>
            </div>
          </div>

          {/* Article Meta */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{samplePost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(samplePost.publishedAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{samplePost.readTime} Min. Lesezeit</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                <Share2 className="w-4 h-4 mr-2" />
                Teilen
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                <Bookmark className="w-4 h-4 mr-2" />
                Speichern
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none text-gray-800
                prose-headings:text-gray-900 prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-700
                prose-ul:mb-4 prose-li:mb-2 prose-li:text-gray-700
                prose-ol:mb-4 prose-ol:text-gray-700
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
              dangerouslySetInnerHTML={{ __html: samplePost.content }}
            />
          </div>

          {/* Author Info */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{samplePost.author}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Ersteller von Deutsch-Lerninhalten und Bildungsplattformen
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Kommentare
                  </Button>
                  <Link href="/blog-new">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                      Alle Artikel ansehen
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
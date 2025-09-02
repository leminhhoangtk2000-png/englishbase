'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  ArrowLeft,
  BookOpen,
  Volume2,
  Download,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { MainNav } from '@/components/main-nav';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  image?: string;
  author: {
    name: string;
    avatar?: string;
  };
  vocabulary?: {
    word: string;
    translation: string;
    example: string;
  }[];
}

// Mock data - trong thực tế sẽ fetch từ API
const mockArticle: NewsArticle = {
  id: '1',
  title: 'Deutschland führt neue Klimaschutzgesetze ein',
  subtitle: 'Bundestag beschließt strengere Regeln für Unternehmen',
  content: `Der Deutsche Bundestag hat heute neue Gesetze zum Klimaschutz verabschiedet. Die neuen Bestimmungen sehen vor, dass Unternehmen mit mehr als 500 Mitarbeitern künftig strengere Auflagen erfüllen müssen.

Die Gesetze betreffen verschiedene Bereiche der Wirtschaft. Besonders die Automobilindustrie und die Energiebranche müssen ihre CO2-Emissionen bis 2030 um mindestens 40 Prozent reduzieren.

Umweltministerin Sarah Müller erklärte: "Diese Gesetze sind ein wichtiger Schritt für den Klimaschutz in Deutschland. Wir müssen jetzt handeln, um die Ziele des Pariser Klimaabkommens zu erreichen."

Die neuen Bestimmungen treten am 1. Januar 2026 in Kraft. Unternehmen haben also noch zwei Jahre Zeit, sich auf die neuen Anforderungen vorzubereiten.

Kritiker bemängeln jedoch, dass die Gesetze nicht weit genug gehen. Die Umweltorganisation "Grüne Zukunft" fordert noch strengere Maßnahmen.

Die Bundesregierung plant außerdem, in den kommenden Jahren weitere Gesetze zum Klimaschutz zu verabschieden. Dazu gehören auch Regelungen für private Haushalte und den Verkehrssektor.`,
  excerpt: 'Deutschland verschärft seine Klimaschutzgesetze. Unternehmen müssen künftig strengere Auflagen erfüllen.',
  category: 'Politik',
  tags: ['Klimaschutz', 'Umwelt', 'Politik', 'Deutschland'],
  publishedAt: new Date().toISOString(),
  readTime: 3,
  views: 1240,
  likes: 89,
  comments: 15,
  difficulty: 'B1',
  image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=600&fit=crop',
  author: {
    name: 'Deutsche Welle',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dw'
  },
  vocabulary: [
    { word: 'verabschieden', translation: 'thông qua (luật)', example: 'Der Bundestag hat das Gesetz verabschiedet.' },
    { word: 'Bestimmungen', translation: 'quy định', example: 'Die neuen Bestimmungen sind sehr streng.' },
    { word: 'Auflagen', translation: 'điều kiện, yêu cầu', example: 'Unternehmen müssen neue Auflagen erfüllen.' },
    { word: 'Emissionen', translation: 'khí thải', example: 'CO2-Emissionen schaden der Umwelt.' },
    { word: 'reduzieren', translation: 'giảm', example: 'Wir müssen die Emissionen reduzieren.' }
  ]
};

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);

  useEffect(() => {
    // Trong thực tế sẽ fetch từ API với params.id
    setArticle(mockArticle);
  }, [params.id]);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800 border-green-200',
      'A2': 'bg-blue-100 text-blue-800 border-blue-200',
      'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'B2': 'bg-orange-100 text-orange-800 border-orange-200',
      'C1': 'bg-red-100 text-red-800 border-red-200',
      'C2': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <MainNav />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/die-neuen">
              <ArrowLeft className="w-4 h-4" />
              Zurück zu Die Neuen
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              {/* Article Header */}
              {article.image && (
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`text-sm font-medium border ${getDifficultyColor(article.difficulty)}`}>
                      {article.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      {article.category}
                    </Badge>
                  </div>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(article.publishedAt), 'dd.MM.yyyy', { locale: de })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} Min. Lesezeit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{article.views} Aufrufe</span>
                  </div>
                </div>

                <CardTitle className="text-2xl md:text-3xl font-bold leading-tight mb-2">
                  {article.title}
                </CardTitle>
                
                {article.subtitle && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                    {article.subtitle}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                {/* Article Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="gap-2"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      {article.likes + (isLiked ? 1 : 0)}
                    </Button>
                    
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {article.comments}
                    </Button>

                    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Teilen
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Volume2 className="w-4 h-4" />
                      Anhören
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg text-white font-bold">
                      {article.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {article.author.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nachrichtenredaktion
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Vocabulary Helper */}
            {article.vocabulary && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Wichtige Wörter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {article.vocabulary.map((vocab, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                          {vocab.word}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {vocab.translation}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 italic">
                          "{vocab.example}"
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Mehr Nachrichten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/die-neuen" className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="text-sm font-medium">Alle Nachrichten</div>
                    <div className="text-xs text-gray-500">Entdecken Sie mehr aktuelle News</div>
                  </Link>
                  
                  <Link href="/vocabulary" className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="text-sm font-medium">Wortschatz üben</div>
                    <div className="text-xs text-gray-500">Verbessern Sie Ihren Wortschatz</div>
                  </Link>
                  
                  <Link href="/exercises" className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="text-sm font-medium">Übungen machen</div>
                    <div className="text-xs text-gray-500">Trainieren Sie Ihr Deutsch</div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

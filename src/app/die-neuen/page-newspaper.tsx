'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/main-nav';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, Calendar, ArrowRight, TrendingUp, Globe } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  url: string;
  isBreaking?: boolean;
  isHot?: boolean;
  views?: number;
}

// German News Data - Realistic content
const newsData: NewsArticle[] = [
  // Breaking News
  {
    id: 'breaking-1',
    title: 'Bundestag beschließt neue Klimaschutzmaßnahmen',
    excerpt: 'Mit großer Mehrheit hat der Deutsche Bundestag heute ein umfassendes Klimaschutzpaket verabschiedet. Die neuen Maßnahmen sollen Deutschland dabei helfen, seine Klimaziele bis 2030 zu erreichen.',
    content: 'Das Parlament stimmte mit 589 von 736 Stimmen für das Gesetz...',
    imageUrl: '/images/shared/bundestag.jpg',
    author: { name: 'Anna Müller' },
    category: 'Politik',
    publishedAt: '2025-02-09T14:30:00Z',
    readTime: '4 Min.',
    url: '#',
    isBreaking: true,
    views: 12547
  },
  
  // Featured Articles
  {
    id: 'featured-1',
    title: 'Deutsche Wirtschaft trotz globaler Unsicherheiten stabil',
    excerpt: 'Trotz internationaler Spannungen zeigt sich die deutsche Wirtschaft robust. Experten sehen positive Signale für das kommende Quartal, warnen aber vor neuen Herausforderungen.',
    content: 'Die neuesten Wirtschaftsdaten zeigen...',
    imageUrl: '/images/shared/economy.jpg',
    author: { name: 'Dr. Michael Schmidt' },
    category: 'Wirtschaft',
    publishedAt: '2025-02-09T12:00:00Z',
    readTime: '6 Min.',
    url: '#',
    isHot: true,
    views: 8934
  },
  {
    id: 'featured-2',
    title: 'Digitalisierung in deutschen Schulen macht Fortschritte',
    excerpt: 'Der DigitalPakt Schule zeigt erste Erfolge. Bundesweit wurden bereits über 1.000 Schulen mit modernster Technologie ausgestattet. Lehrer berichten von positiven Erfahrungen.',
    content: 'In den letzten zwei Jahren hat sich...',
    imageUrl: '/images/shared/education.jpg',
    author: { name: 'Lisa Weber' },
    category: 'Bildung',
    publishedAt: '2025-02-09T11:15:00Z',
    readTime: '5 Min.',
    url: '#',
    views: 6721
  },
  {
    id: 'featured-3',
    title: 'Neue Technologien revolutionieren deutsche Industrie',
    excerpt: 'Künstliche Intelligenz und Automatisierung verändern die deutsche Industrielandschaft grundlegend. Unternehmen investieren massiv in neue Technologien.',
    content: 'Deutsche Industrieunternehmen setzen verstärkt...',
    imageUrl: '/images/shared/industry.jpg',
    author: { name: 'Prof. Dr. Thomas Klein' },
    category: 'Technologie',
    publishedAt: '2025-02-09T10:45:00Z',
    readTime: '7 Min.',
    url: '#',
    views: 5892
  },

  // More Articles
  {
    id: 'sport-1',
    title: 'Bundesliga: Spannender Kampf um die Meisterschaft',
    excerpt: 'Nur wenige Punkte trennen die Spitzenteams. Bayern München, Borussia Dortmund und Bayer Leverkusen liefern sich ein packendes Rennen um den Titel.',
    content: 'Der 23. Spieltag brachte...',
    author: { name: 'Marco Rossi' },
    category: 'Sport',
    publishedAt: '2025-02-09T09:30:00Z',
    readTime: '3 Min.',
    url: '#',
    views: 4156
  },
  {
    id: 'culture-1',
    title: 'Berlinale 2025: Deutsche Filme im internationalen Rampenlicht',
    excerpt: 'Die 75. Berlinale präsentiert herausragende deutsche Produktionen. Regisseure wie Fatih Akin und Caroline Link konkurrieren um den Goldenen Bären.',
    content: 'Die diesjährige Berlinale...',
    author: { name: 'Elena Hoffmann' },
    category: 'Kultur',
    publishedAt: '2025-02-09T08:20:00Z',
    readTime: '4 Min.',
    url: '#',
    views: 3287
  },
  {
    id: 'health-1',
    title: 'Gesundheitssystem: Neue Reformen geplant',
    excerpt: 'Bundesgesundheitsminister kündigt umfassende Reformen an. Ziel ist eine bessere Versorgung in ländlichen Gebieten und kürzere Wartezeiten.',
    content: 'Das deutsche Gesundheitssystem...',
    author: { name: 'Dr. Petra Schulz' },
    category: 'Gesundheit',
    publishedAt: '2025-02-09T07:50:00Z',
    readTime: '5 Min.',
    url: '#',
    views: 2945
  }
];

const categories = [
  { name: 'Alle', slug: 'all', color: 'bg-gray-100 text-gray-800' },
  { name: 'Politik', slug: 'politik', color: 'bg-red-100 text-red-800' },
  { name: 'Wirtschaft', slug: 'wirtschaft', color: 'bg-green-100 text-green-800' },
  { name: 'Technologie', slug: 'technologie', color: 'bg-blue-100 text-blue-800' },
  { name: 'Sport', slug: 'sport', color: 'bg-orange-100 text-orange-800' },
  { name: 'Kultur', slug: 'kultur', color: 'bg-purple-100 text-purple-800' },
  { name: 'Gesundheit', slug: 'gesundheit', color: 'bg-teal-100 text-teal-800' },
];

export default function DieNeuen() {
  const [articles, setArticles] = useState<NewsArticle[]>(newsData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category.toLowerCase() === selectedCategory);

  const breakingNews = articles.filter(a => a.isBreaking);
  const featuredArticles = articles.filter(a => a.isHot && !a.isBreaking);
  const regularArticles = articles.filter(a => !a.isHot && !a.isBreaking);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Vor wenigen Minuten';
    if (diffHours === 1) return 'Vor 1 Stunde';
    if (diffHours < 24) return `Vor ${diffHours} Stunden`;
    return formatDate(dateString);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Die Neuen</h1>
              <p className="text-sm text-gray-600">Deutsche Nachrichten • Aktuell und Verlässlich</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('de-DE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {currentTime.toLocaleTimeString('de-DE', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breaking News Banner */}
      {breakingNews.length > 0 && (
        <div className="bg-red-600 text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                EILMELDUNG
              </span>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium animate-marquee whitespace-nowrap">
                  {breakingNews[0].title} • {breakingNews[0].excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${selectedCategory === category.slug 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : category.color + ' hover:shadow-md'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
                  Schlagzeilen
                </h2>
                
                <div className="grid gap-8">
                  {/* Main Featured Article */}
                  <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                          <div className="text-white text-center p-6">
                            <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-sm opacity-75">Nachrichtenbild</p>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 p-8">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {featuredArticles[0].category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatRelativeTime(featuredArticles[0].publishedAt)}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                          {featuredArticles[0].title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {featuredArticles[0].excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            <span>{featuredArticles[0].author.name}</span>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{featuredArticles[0].readTime}</span>
                          </div>
                          <Link href={featuredArticles[0].url} className="text-blue-600 hover:text-blue-800 font-medium">
                            Weiterlesen <ArrowRight className="w-4 h-4 inline ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Secondary Featured Articles */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredArticles.slice(1, 3).map((article) => (
                      <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-xs opacity-75">Nachrichtenbild</p>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                              {article.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(article.publishedAt)}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                              <User className="w-3 h-3" />
                              <span>{article.author.name}</span>
                            </div>
                            <span className="text-blue-600 font-medium">{article.readTime}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Regular Articles */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-green-600 pl-4">
                Weitere Nachrichten
              </h2>
              
              <div className="space-y-6">
                {regularArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                            {article.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatRelativeTime(article.publishedAt)}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{article.author.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{article.readTime}</span>
                            </div>
                            {article.views && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>{article.views.toLocaleString()} Aufrufe</span>
                              </div>
                            )}
                          </div>
                          <Link href={article.url} className="text-blue-600 hover:text-blue-800 font-medium">
                            Lesen <ArrowRight className="w-4 h-4 inline ml-1" />
                          </Link>
                        </div>
                      </div>
                      
                      <div className="w-32 h-24 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-8 h-8 text-white opacity-50" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Most Read */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Meistgelesen
                </h3>
                <div className="space-y-4">
                  {articles.slice(0, 5).map((article, index) => (
                    <div key={article.id} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 leading-tight mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(article.publishedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Wetter</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">18°C</div>
                  <div className="text-sm opacity-90 mb-2">Bewölkt</div>
                  <div className="text-xs opacity-75">Berlin • Heute</div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Service
                </h3>
                <div className="space-y-2">
                  {['Börse', 'Verkehr', 'Stellenmarkt', 'Immobilien', 'Reise'].map((link) => (
                    <Link key={link} href="#" className="block text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Newsletter abonnieren</h3>
          <p className="mb-6 opacity-90">Bleiben Sie mit unserem täglichen Newsletter über die wichtigsten Nachrichten informiert.</p>
          <div className="flex max-w-md mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Ihre E-Mail-Adresse"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Abonnieren
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Die Neuen</h4>
              <p className="text-gray-400 text-sm">
                Ihre vertrauensvolle Quelle für deutsche Nachrichten und Analysen.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rubriken</h4>
              <div className="space-y-2 text-sm">
                {categories.slice(1).map((cat) => (
                  <Link key={cat.slug} href="#" className="block text-gray-400 hover:text-white">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Service</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-gray-400 hover:text-white">RSS-Feed</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Mobile App</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Newsletter</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>redaktion@die-neuen.de</p>
                <p>+49 30 12345678</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Die Neuen. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

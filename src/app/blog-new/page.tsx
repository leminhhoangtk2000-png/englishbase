'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MainNav } from '@/components/main-nav';
import { LikeDisplay } from '@/components/ui/like-display';
import { ThemedBadge } from '@/components/ui/themed-badge';

// Mock blog posts data
const blogPosts = [
  {
    id: 'first-post',
    title: 'Mein Weg zum Deutschlernen: Eine Reise voller Entdeckungen',
    excerpt: 'Die deutsche Sprache zu lernen war für mich eine der bereicherndsten Erfahrungen meines Lebens. In diesem Artikel teile ich meine persönlichen Erfahrungen und praktische Tipps.',
    content: `
      <p>Als ich vor drei Jahren beschloss, Deutsch zu lernen, hätte ich nie gedacht, dass diese Entscheidung mein Leben so sehr verändern würde. Was als einfacher Wunsch begann, eine neue Sprache zu beherrschen, entwickelte sich zu einer faszinierenden Reise durch Kultur, Geschichte und persönliche Entwicklung.</p>
      
      <h2>Die ersten Schritte</h2>
      <p>Am Anfang war alles überwältigend. Die deutsche Grammatik schien wie ein unlösbares Rätsel, und die Aussprache bereitete mir große Schwierigkeiten. Doch ich ließ mich nicht entmutigen.</p>
      
      <h3>Meine Lernstrategie</h3>
      <ul>
        <li>Täglich 30 Minuten Vokabeln lernen</li>
        <li>Deutsche Filme mit Untertiteln schauen</li>
        <li>Regelmäßig mit Muttersprachlern sprechen</li>
        <li>Deutsche Bücher lesen (anfangs Kinderbücher)</li>
      </ul>
      
      <h2>Herausforderungen und Durchbrüche</h2>
      <p>Nach sechs Monaten intensiven Lernens hatte ich meinen ersten großen Durchbruch. Ich konnte endlich ein ganzes Gespräch auf Deutsch führen, ohne ständig nach Worten zu suchen.</p>
      
      <h2>Kulturelle Entdeckungen</h2>
      <p>Das Erlernen der deutschen Sprache öffnete mir die Tür zu einer reichen Kultur. Von Goethe bis zu modernen deutschen Filmen - ich entdeckte eine völlig neue Welt.</p>
      
      <h2>Tipps für andere Lernende</h2>
      <p>Wenn Sie Deutsch lernen möchten, sind hier meine wichtigsten Ratschläge:</p>
      <ol>
        <li>Seien Sie geduldig mit sich selbst</li>
        <li>Praktizieren Sie täglich, auch wenn es nur 15 Minuten sind</li>
        <li>Haben Sie keine Angst vor Fehlern</li>
        <li>Tauchen Sie in die deutsche Kultur ein</li>
        <li>Finden Sie einen Tandempartner</li>
      </ol>
    `,
    author: 'Anna Nguyen',
    authorBio: 'Deutschlehrerin und Sprachliebhaberin aus Vietnam',
    publishedAt: '2024-12-15T10:00:00Z',
    readTime: 8,
    category: 'Persönliche Erfahrung',
    tags: ['Deutschlernen', 'Sprache', 'Erfahrung', 'Tipps'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    featured: true
  },
  {
    id: 'german-grammar-tips',
    title: 'Deutsche Grammatik leicht gemacht: 10 praktische Tipps',
    excerpt: 'Die deutsche Grammatik muss nicht kompliziert sein. Hier sind 10 bewährte Strategien, um die Grundlagen zu meistern und typische Fehler zu vermeiden.',
    content: `
      <p>Deutsche Grammatik hat den Ruf, besonders schwierig zu sein. Aber mit den richtigen Strategien und einem systematischen Ansatz können Sie die wichtigsten Regeln schnell verstehen und anwenden.</p>
      
      <h2>1. Die vier Fälle verstehen</h2>
      <p>Der Nominativ, Akkusativ, Dativ und Genitiv sind das Herzstück der deutschen Grammatik. Lernen Sie die Fragewörter:</p>
      <ul>
        <li>Nominativ: Wer oder was?</li>
        <li>Akkusativ: Wen oder was?</li>
        <li>Dativ: Wem?</li>
        <li>Genitiv: Wessen?</li>
      </ul>
      
      <h2>2. Artikel richtig verwenden</h2>
      <p>Der, die, das - diese drei Artikel bestimmen das Geschlecht der Substantive. Lernen Sie Substantive immer zusammen mit ihrem Artikel.</p>
      
      <h2>3. Verben konjugieren</h2>
      <p>Beginnen Sie mit den häufigsten Verben wie sein, haben, werden und den Modalverben. Diese bilden das Fundament für komplexere Strukturen.</p>
      
      <h2>4. Satzstellung beachten</h2>
      <p>Im deutschen Hauptsatz steht das Verb an zweiter Stelle. Im Nebensatz wandert es ans Ende.</p>
      
      <h2>5. Präpositionen mit Fällen</h2>
      <p>Jede Präposition verlangt einen bestimmten Fall. Lernen Sie die häufigsten Kombinationen auswendig.</p>
    `,
    author: 'Dr. Michael Weber',
    authorBio: 'Germanistikprofessor und Autor mehrerer Deutschlehrbücher',
    publishedAt: '2024-12-10T14:30:00Z',
    readTime: 6,
    category: 'Grammatik',
    tags: ['Grammatik', 'Tipps', 'Lernen', 'Grundlagen'],
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
    featured: false
  },
  {
    id: 'german-culture-guide',
    title: 'Deutsche Kultur verstehen: Ein Leitfaden für Deutschlernende',
    excerpt: 'Sprache und Kultur sind untrennbar miteinander verbunden. Entdecken Sie die wichtigsten Aspekte der deutschen Kultur, die Ihnen beim Sprachenlernen helfen.',
    content: `
      <p>Um eine Sprache wirklich zu verstehen, muss man auch die Kultur kennen, in der sie gesprochen wird. Deutschland hat eine reiche kulturelle Tradition, die sich in der Sprache widerspiegelt.</p>
      
      <h2>Deutsche Werte und Mentalität</h2>
      <p>Pünktlichkeit, Gründlichkeit und Direktheit sind typisch deutsche Eigenschaften, die sich auch in der Sprache zeigen.</p>
      
      <h2>Feiertage und Traditionen</h2>
      <p>Von Oktoberfest bis Weihnachtsmärkte - deutsche Traditionen bieten viele Gelegenheiten, die Sprache in authentischen Kontexten zu erleben.</p>
      
      <h2>Regionale Unterschiede</h2>
      <p>Deutschland ist vielfältig. Verschiedene Regionen haben ihre eigenen Dialekte und kulturellen Besonderheiten.</p>
      
      <h2>Business-Kultur</h2>
      <p>Im deutschen Geschäftsleben gibt es bestimmte Umgangsformen und sprachliche Konventionen, die wichtig zu kennen sind.</p>
    `,
    author: 'Lisa Hoffmann',
    authorBio: 'Kulturwissenschaftlerin und Dozentin für interkulturelle Kommunikation',
    publishedAt: '2024-12-08T16:15:00Z',
    readTime: 7,
    category: 'Kultur',
    tags: ['Kultur', 'Deutschland', 'Gesellschaft', 'Tradition'],
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=400&fit=crop',
    featured: true
  },
  {
    id: 'vocabulary-building',
    title: 'Wortschatz effektiv erweitern: Moderne Methoden für das Vokabellernen',
    excerpt: 'Vergessen Sie langweiliges Auswendiglernen! Entdecken Sie innovative Techniken und digitale Tools, um Ihren deutschen Wortschatz nachhaltig zu erweitern.',
    content: `
      <p>Ein umfangreicher Wortschatz ist der Schlüssel zum erfolgreichen Deutschlernen. Doch wie kann man effektiv und nachhaltig neue Vokabeln lernen?</p>
      
      <h2>Die Wissenschaft des Wortschatzerwerbs</h2>
      <p>Unser Gehirn lernt Wörter am besten in Kontexten und durch wiederholte Anwendung in verschiedenen Situationen.</p>
      
      <h2>Moderne Lernmethoden</h2>
      <h3>1. Spaced Repetition System (SRS)</h3>
      <p>Apps wie Anki nutzen wissenschaftlich bewiesene Wiederholungsintervalle.</p>
      
      <h3>2. Kontextuelles Lernen</h3>
      <p>Lernen Sie Vokabeln in ganzen Sätzen, nicht isoliert.</p>
      
      <h3>3. Visuelle Assoziationen</h3>
      <p>Verbinden Sie neue Wörter mit Bildern oder Geschichten.</p>
      
      <h2>Digitale Tools</h2>
      <ul>
        <li>Memrise für spielerisches Lernen</li>
        <li>Quizlet für Karteikarten</li>
        <li>Lingvist für adaptive Algorithmen</li>
        <li>Der Duden App für Definitionen</li>
      </ul>
      
      <h2>Praktische Übungen</h2>
      <p>Integrieren Sie neue Wörter sofort in Ihren aktiven Sprachgebrauch durch Schreiben und Sprechen.</p>
    `,
    author: 'Prof. Dr. Sarah Klein',
    authorBio: 'Neurolinguistin und Expertin für Sprachlernforschung',
    publishedAt: '2024-12-05T11:20:00Z',
    readTime: 5,
    category: 'Methodik',
    tags: ['Wortschatz', 'Lerntechniken', 'Apps', 'Methoden'],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    featured: false
  }
];

export default function BlogNewMainPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deutsch lernen Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie hilfreiche Artikel, Tipps und Geschichten rund um das Deutschlernen. 
            Von Grammatik bis Kultur - hier finden Sie alles für Ihre Sprachlernreise.
          </p>
        </header>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Empfohlene Artikel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <ThemedBadge variant="themed">
                        {post.category}
                      </ThemedBadge>
                      <span>•</span>
                      <span>{post.readTime} Min. Lesezeit</span>
                      <span>•</span>
                      <LikeDisplay url={`/blog-new/${post.id}`} initialLikes={post.id === 'first-post' ? 42 : post.id === 'german-grammar-tips' ? 38 : post.id === 'vocabulary-building' ? 29 : 15} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      <Link href={`/blog-new/${post.id}`} className="hover:text-gray-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{post.author}</p>
                          <p className="text-gray-500">
                            {new Date(post.publishedAt).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                      </div>
                      <Link href={`/blog-new/${post.id}`}>
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                          Lesen
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Alle Artikel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <ThemedBadge variant="themed" className="text-xs">
                      {post.category}
                    </ThemedBadge>
                    <span>•</span>
                    <span>{post.readTime} Min.</span>
                    <span>•</span>
                    <LikeDisplay url={`/blog-new/${post.id}`} initialLikes={post.id === 'first-post' ? 42 : post.id === 'german-grammar-tips' ? 38 : post.id === 'vocabulary-building' ? 29 : 15} className="text-xs" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/blog-new/${post.id}`} className="hover:text-gray-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{post.author}</span>
                    <span className="text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-16 text-center">
          <Card className="border-gray-200 bg-gray-100">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Verpassen Sie keine neuen Artikel
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Erhalten Sie die neuesten Tipps und Artikel zum Deutschlernen direkt in Ihren Posteingang.
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Abonnieren
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

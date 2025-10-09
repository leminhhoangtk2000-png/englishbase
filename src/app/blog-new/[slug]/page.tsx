'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, ThumbsUp, Bookmark, MessageCircle, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MainNav } from '@/components/main-nav';
import { Comments } from '@/components/ui/comments';
import { LikeButton } from '@/components/ui/like-button';
import { ThemedButton } from '@/components/ui/themed-button';
import { ThemedBadge } from '@/components/ui/themed-badge';

// Mock blog posts data (same as in main page)
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
      
      <blockquote>
        <p>"Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt." - Ludwig Wittgenstein</p>
      </blockquote>
      
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
      
      <h2>Fazit</h2>
      <p>Das Deutschlernen war mehr als nur das Erlernen einer neuen Sprache - es war eine Reise der Selbstentdeckung. Heute kann ich sagen, dass diese Entscheidung eine der besten meines Lebens war.</p>
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
        <li><strong>Nominativ:</strong> Wer oder was?</li>
        <li><strong>Akkusativ:</strong> Wen oder was?</li>
        <li><strong>Dativ:</strong> Wem?</li>
        <li><strong>Genitiv:</strong> Wessen?</li>
      </ul>
      
      <h2>2. Artikel richtig verwenden</h2>
      <p>Der, die, das - diese drei Artikel bestimmen das Geschlecht der Substantive. Lernen Sie Substantive immer zusammen mit ihrem Artikel.</p>
      
      <h3>Tipp: Farbcodierung</h3>
      <p>Verwenden Sie verschiedene Farben für verschiedene Artikel:</p>
      <ul>
        <li>Blau für "der" (maskulin)</li>
        <li>Rot für "die" (feminin)</li>
        <li>Grün für "das" (neutrum)</li>
      </ul>
      
      <h2>3. Verben konjugieren</h2>
      <p>Beginnen Sie mit den häufigsten Verben wie sein, haben, werden und den Modalverben. Diese bilden das Fundament für komplexere Strukturen.</p>
      
      <h2>4. Satzstellung beachten</h2>
      <p>Im deutschen Hauptsatz steht das Verb an zweiter Stelle. Im Nebensatz wandert es ans Ende.</p>
      
      <h2>5. Präpositionen mit Fällen</h2>
      <p>Jede Präposition verlangt einen bestimmten Fall. Lernen Sie die häufigsten Kombinationen auswendig.</p>
      
      <blockquote>
        <p>"Übung macht den Meister" - dieses deutsche Sprichwort gilt besonders für die Grammatik!</p>
      </blockquote>
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
      
      <h3>Pünktlichkeit</h3>
      <p>In Deutschland ist Pünktlichkeit nicht nur höflich, sondern erwartet. "5 Minuten vor der Zeit ist des Deutschen Pünktlichkeit."</p>
      
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
        <li><strong>Memrise</strong> für spielerisches Lernen</li>
        <li><strong>Quizlet</strong> für Karteikarten</li>
        <li><strong>Lingvist</strong> für adaptive Algorithmen</li>
        <li><strong>Der Duden App</strong> für Definitionen</li>
      </ul>
      
      <h2>Praktische Übungen</h2>
      <p>Integrieren Sie neue Wörter sofort in Ihren aktiven Sprachgebrauch durch Schreiben und Sprechen.</p>
      
      <blockquote>
        <p>"Ein Wort, das man nicht benutzt, ist wie ein Werkzeug, das im Schuppen verstaubt."</p>
      </blockquote>
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

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const slug = params.slug as string;
    const foundPost = blogPosts.find(p => p.id === slug);
    
    if (!foundPost) {
      notFound();
      return;
    }

    setPost(foundPost);
    
    // Get related posts (other posts from same category)
    const related = blogPosts
      .filter(p => p.id !== slug && p.category === foundPost.category)
      .slice(0, 3);
    setRelatedPosts(related);
  }, [params.slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Artikel wird geladen...</h1>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link wurde in die Zwischenablage kopiert!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Article Container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog-new">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <ThemedBadge variant="themed" className="mb-4">
            {post.category}
          </ThemedBadge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author and Meta */}
          <div className="flex items-center gap-4 pb-8 border-b border-gray-200">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium text-gray-900">{post.author}</span>
                <span>·</span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span>·</span>
                <span>{post.readTime} Min. Lesezeit</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{post.authorBio}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleShare} variant="ghost" size="sm" className="text-gray-600">
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => setIsBookmarked(!isBookmarked)} 
                variant="ghost" 
                size="sm"
                className="text-gray-600"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </header>

        {/* Like Button - Top */}
        <div className="flex justify-center mb-8">
          <LikeButton url={`/blog-new/${post.id}`} initialLikes={post.id === 'first-post' ? 42 : post.id === 'german-grammar-tips' ? 38 : post.id === 'vocabulary-building' ? 29 : 15} />
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto">
          <div 
            className="prose prose-xl max-w-none text-gray-800
              prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
              prose-p:mb-6 prose-p:leading-relaxed prose-p:text-gray-700 prose-p:text-lg
              prose-ul:mb-6 prose-li:mb-2 prose-li:text-gray-700 prose-li:text-lg
              prose-ol:mb-6 prose-ol:text-gray-700 prose-ol:text-lg
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:text-xl prose-blockquote:my-8
              prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Tags */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string, tagIndex: number) => (
              <Badge key={`${tag}-${tagIndex}`} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Like Button - Bottom */}
        <div className="max-w-3xl mx-auto mt-12 flex justify-center">
          <LikeButton url={`/blog-new/${post.id}`} initialLikes={post.id === 'first-post' ? 42 : post.id === 'german-grammar-tips' ? 38 : post.id === 'vocabulary-building' ? 29 : 15} />
        </div>

        {/* Author Footer */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{post.author}</h3>
                <ThemedButton themeVariant="outline" size="sm">
                  Folgen
                </ThemedButton>
              </div>
              <p className="text-gray-600 mb-4">{post.authorBio}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="max-w-3xl mx-auto mt-12">
          <Comments url={`/blog-new/${post.id}`} />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-3xl mx-auto mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Mehr von {post.author}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog-new/${relatedPost.id}`} className="group">
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{new Date(relatedPost.publishedAt).toLocaleDateString('de-DE')}</span>
                    <span className="mx-2">·</span>
                    <span>{relatedPost.readTime} Min.</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

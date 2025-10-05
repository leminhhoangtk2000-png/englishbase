'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { ArrowLeft, Calendar, User, Clock, Tag, Share2, Bookmark, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MainNav } from '@/components/main-nav'
import { Comments } from '@/components/ui/comments'
import { LikeButton } from '@/components/ui/like-button'
import { ThemedButton } from '@/components/ui/themed-button'
import { ThemedBadge } from '@/components/ui/themed-badge'
import { ReadingExerciseComponent } from '@/components/reading-exercise/reading-exercise'
import { getExerciseByArticleId } from '@/data/reading-exercises'
import { VocabularySidebar } from '@/components/vocabulary-search/vocabulary-sidebar'
import { VocabularyMobileToggle } from '@/components/vocabulary-search/vocabulary-mobile-toggle'
import { ArticlePageCompletion } from '@/components/articles/ArticlePageCompletion'
import { useTheme } from '@/hooks/use-theme'
import { getUITheme } from '@/config/themes'

// Mock data for articles (same as in main page)
const mockArticles = [
  {
    id: '1',
    title: 'Deutschland führt neue Energiepolitik ein',
    summary: 'Die Bundesregierung plant umfassende Reformen im Energiesektor. Neue Gesetze sollen den Übergang zu erneuerbaren Energien beschleunigen.',
    content: `
      <p>Die deutsche Bundesregierung hat heute ein umfassendes Energiepaket vorgestellt, das den Weg für eine nachhaltigere Zukunft ebnen soll. Die neuen Maßnahmen zielen darauf ab, den Anteil erneuerbarer Energien bis 2030 auf 80% zu steigern.</p>
      
      <h2>Kernpunkte der Reform</h2>
      <p>Zu den wichtigsten Änderungen gehören:</p>
      <ul>
        <li>Massive Investitionen in Windkraft und Solarenergie</li>
        <li>Vereinfachte Genehmigungsverfahren für erneuerbare Projekte</li>
        <li>Neue Förderprogramme für Privathaushalte</li>
        <li>Ausbau der Elektromobilität-Infrastruktur</li>
      </ul>
      
      <h2>Finanzierung und Zeitplan</h2>
      <p>Das Gesamtvolumen der Investitionen beläuft sich auf 150 Milliarden Euro über die nächsten 10 Jahre. Die ersten Maßnahmen sollen bereits im kommenden Quartal umgesetzt werden.</p>
      
      <p>Bundeswirtschaftsminister Robert Habeck betonte: "Diese Reform ist ein entscheidender Schritt für Deutschlands Energieunabhängigkeit und den Klimaschutz."</p>
      
      <h2>Reaktionen aus der Wirtschaft</h2>
      <p>Die deutsche Industrie zeigt sich überwiegend positiv. Der Bundesverband der Deutschen Industrie (BDI) lobte die klaren Zielvorgaben und die verfügbaren Fördermittel.</p>
      
      <p>Kritik kommt hingegen von kleineren Energieversorgern, die Sorgen über die Finanzierbarkeit der Transformation äußern.</p>
    `,
    author: 'Anna Müller',
    publishedAt: '2024-02-15T10:30:00Z',
    category: 'Politik',
    readTime: 5,
    image: 'https://via.placeholder.com/800x400/1e40af/ffffff?text=🏛️+Energiepolitik+Deutschland',
    tags: ['Energie', 'Politik', 'Umwelt', 'Wirtschaft']
  },
  {
    id: '2',
    title: 'Künstliche Intelligenz revolutioniert deutsche Industrie',
    summary: 'Neue KI-Technologien verändern die Produktionsprozesse in deutschen Unternehmen. Experten erwarten einen Produktivitätsschub von 30%.',
    content: `
      <p>Die deutsche Industrie steht vor einem technologischen Wandel. Künstliche Intelligenz (KI) hält Einzug in Fabriken und verändert fundamental die Art, wie produziert wird.</p>
      
      <h2>KI in der Produktion</h2>
      <p>Führende deutsche Unternehmen setzen bereits auf KI-gestützte Systeme:</p>
      <ul>
        <li>Predictive Maintenance zur Wartungsoptimierung</li>
        <li>Automatisierte Qualitätskontrolle</li>
        <li>Intelligente Logistik und Lieferkettenmanagement</li>
        <li>Adaptive Produktionsplanung</li>
      </ul>
      
      <h2>Investitionen und Förderung</h2>
      <p>Die Bundesregierung hat ein 5-Milliarden-Euro-Programm für KI-Forschung und -Entwicklung aufgelegt. Schwerpunkte liegen auf der Unterstützung von KMUs und der Ausbildung von Fachkräften.</p>
      
      <p>Prof. Dr. Sarah Weber vom Fraunhofer-Institut erklärt: "Deutschland hat das Potenzial, bei industrieller KI weltweit führend zu werden."</p>
      
      <h2>Herausforderungen</h2>
      <p>Trotz der Chancen gibt es auch Hürden:</p>
      <ul>
        <li>Fachkräftemangel im IT-Bereich</li>
        <li>Hohe Anfangsinvestitionen</li>
        <li>Datenschutz und Sicherheitsbedenken</li>
        <li>Widerstand bei traditionellen Arbeitsplätzen</li>
      </ul>
      
      <h2>Ausblick</h2>
      <p>Experten prognostizieren, dass bis 2030 etwa 70% der deutschen Industrieunternehmen KI-Technologien einsetzen werden. Dies könnte Deutschland einen entscheidenden Wettbewerbsvorteil verschaffen.</p>
    `,
    author: 'Dr. Michael Schmidt',
    publishedAt: '2024-02-14T14:15:00Z',
    category: 'Technologie',
    readTime: 7,
    image: 'https://via.placeholder.com/800x400/059669/ffffff?text=🤖+KI+Industrie',
    tags: ['KI', 'Industrie', 'Innovation', 'Digitalisierung']
  },
  {
    id: '3',
    title: 'Neue Wohnungsbauinitiative für bezahlbaren Wohnraum',
    summary: 'Bundesregierung startet Programm für 400.000 neue Wohnungen. Fokus liegt auf nachhaltigen und bezahlbaren Lösungen.',
    content: `
      <p>Deutschland startet eine der größten Wohnungsbauinitiativen der vergangenen Jahrzehnte. Das neue Programm soll den akuten Wohnungsmangel in Ballungsräumen bekämpfen.</p>
      
      <h2>Umfang der Initiative</h2>
      <p>Das Programm umfasst:</p>
      <ul>
        <li>400.000 neue Wohnungen bis 2027</li>
        <li>Davon 100.000 Sozialwohnungen</li>
        <li>Fokus auf nachhaltige Baumaterialien</li>
        <li>Innovative Architektur- und Wohnkonzepte</li>
      </ul>
      
      <h2>Finanzierung</h2>
      <p>Bund und Länder stellen gemeinsam 25 Milliarden Euro zur Verfügung. Zusätzlich werden private Investoren durch Steuererleichterungen und Bürgschaften unterstützt.</p>
      
      <p>Bauministerin Klara Geywitz: "Wohnen ist ein Grundrecht. Diese Initiative wird das Gesicht unserer Städte nachhaltig prägen."</p>
      
      <h2>Schwerpunktregionen</h2>
      <p>Besondere Aufmerksamkeit erhalten:</p>
      <ul>
        <li>Berlin und Umland</li>
        <li>München und Oberbayern</li>
        <li>Hamburg-Metropolregion</li>
        <li>Rhein-Main-Gebiet</li>
        <li>Köln-Düsseldorf-Region</li>
      </ul>
      
      <h2>Nachhaltigkeit im Fokus</h2>
      <p>Alle neuen Projekte müssen strengste Energiestandards erfüllen. Geplant sind außerdem begrünte Dächer, Photovoltaikanlagen und innovative Heizkonzepte.</p>
      
      <h2>Kritik und Herausforderungen</h2>
      <p>Experten warnen vor möglichen Engpässen bei Baumaterialien und Fachkräften. Opposition kritisiert die langsamen Planungsverfahren.</p>
    `,
    author: 'Lisa Weber',
    publishedAt: '2024-02-13T09:45:00Z',
    category: 'Gesellschaft',
    readTime: 6,
    image: 'https://via.placeholder.com/800x400/7c3aed/ffffff?text=🏠+Wohnungsbau',
    tags: ['Wohnen', 'Politik', 'Nachhaltigkeit', 'Städtebau']
  },
  {
    id: '4',
    title: 'Digitale Bildung: Schulen erhalten moderne Technologie',
    summary: 'Milliardenschweres Programm stattet deutsche Schulen mit neuester Technik aus. Tablets und interaktive Whiteboards für alle Klassenzimmer.',
    content: `
      <p>Deutschland investiert massiv in die digitale Ausstattung seiner Schulen. Ein neues Programm im Wert von 3 Milliarden Euro soll alle Bildungseinrichtungen mit moderner Technologie ausstatten.</p>
      
      <h2>Ausstattung der Schulen</h2>
      <p>Jede Schule erhält:</p>
      <ul>
        <li>Tablets für alle Schüler und Lehrer</li>
        <li>Interaktive Whiteboards in jedem Klassenzimmer</li>
        <li>Hochgeschwindigkeits-Internet</li>
        <li>Digitale Lernplattformen</li>
        <li>Virtual Reality-Ausrüstung für naturwissenschaftliche Fächer</li>
      </ul>
      
      <h2>Lehrerfortbildung</h2>
      <p>Parallel zur technischen Ausstattung werden alle Lehrkräfte in der Nutzung digitaler Medien geschult. Spezielle Fortbildungsprogramme bereiten sie auf den modernen Unterricht vor.</p>
      
      <p>Bildungsministerin Bettina Stark-Watzinger: "Die Zukunft des Lernens ist digital. Wir müssen unsere Kinder auf die Arbeitswelt von morgen vorbereiten."</p>
      
      <h2>Neue Lernmethoden</h2>
      <p>Die Technologie ermöglicht innovative Unterrichtsformen:</p>
      <ul>
        <li>Virtuelle Museumsbesuche im Geschichtsunterricht</li>
        <li>3D-Modelle in Biologie und Chemie</li>
        <li>Programmieren als Pflichtfach</li>
        <li>Kollaborative Online-Projekte</li>
      </ul>
      
      <h2>Internationale Zusammenarbeit</h2>
      <p>Deutsche Schulen können künftig einfacher mit Partnerschulen weltweit zusammenarbeiten. Digitaler Austausch wird zum Standard.</p>
    `,
    author: 'Prof. Dr. Elena Richter',
    publishedAt: '2024-02-12T11:20:00Z',
    category: 'Bildung',
    readTime: 5,
    image: 'https://via.placeholder.com/800x400/dc2626/ffffff?text=💻+Digitale+Bildung',
    tags: ['Bildung', 'Digitalisierung', 'Schule', 'Technologie']
  },
  {
    id: '5',
    title: 'Deutsche Wirtschaft wächst trotz globaler Herausforderungen',
    summary: 'BIP steigt um 2,1% im vergangenen Quartal. Exportstarke Branchen treiben das Wachstum an, trotz internationaler Unsicherheiten.',
    content: `
      <p>Die deutsche Wirtschaft zeigt sich robust gegenüber globalen Herausforderungen. Das Bruttoinlandsprodukt (BIP) wuchs im letzten Quartal um beeindruckende 2,1%.</p>
      
      <h2>Wachstumstreiber</h2>
      <p>Folgende Branchen führten das Wachstum an:</p>
      <ul>
        <li>Maschinenbau (+3,5%)</li>
        <li>Automobilindustrie (+2,8%)</li>
        <li>Chemische Industrie (+2,2%)</li>
        <li>Erneuerbare Energien (+4,1%)</li>
        <li>Informationstechnologie (+3,9%)</li>
      </ul>
      
      <h2>Arbeitsmarkt stabil</h2>
      <p>Die Arbeitslosenquote sank auf 5,2% - den niedrigsten Stand seit 20 Jahren. Besonders im MINT-Bereich entstehen neue Arbeitsplätze.</p>
      
      <p>Wirtschaftsminister Dr. Andreas Hoffmann: "Diese Zahlen belegen die Stärke des deutschen Wirtschaftsmodells. Innovation und Qualität sind unsere Erfolgsrezepte."</p>
      
      <h2>Herausforderungen bleiben</h2>
      <p>Trotz positiver Entwicklung gibt es Risiken:</p>
      <ul>
        <li>Steigende Rohstoffpreise</li>
        <li>Fachkräftemangel in Schlüsselbranchen</li>
        <li>Geopolitische Spannungen</li>
        <li>Lieferkettenprobleme</li>
      </ul>
      
      <h2>Zukunftsaussichten</h2>
      <p>Ökonomen sind optimistisch für das kommende Jahr. Investitionen in Nachhaltigkeit und Digitalisierung sollen das Wachstum weiter stützen.</p>
    `,
    author: 'Dr. Marcus Fischer',
    publishedAt: '2024-02-11T16:00:00Z',
    category: 'Wirtschaft',
    readTime: 4,
    image: 'https://via.placeholder.com/800x400/ea580c/ffffff?text=📈+Wirtschaftswachstum',
    tags: ['Wirtschaft', 'BIP', 'Wachstum', 'Arbeitsmarkt']
  }
]

export default function ArticlePage() {
  const params = useParams()
  const { theme } = useTheme()
  const [article, setArticle] = useState<any>(null)
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [exercise, setExercise] = useState<any>(null)

  useEffect(() => {
    const articleId = params.id as string
    const foundArticle = mockArticles.find(a => a.id === articleId)
    
    if (!foundArticle) {
      notFound()
    }

    setArticle(foundArticle)
    
    // Get reading exercise for this article
    const articleExercise = getExerciseByArticleId(articleId)
    setExercise(articleExercise)
    
    // Get related articles (other articles from same category)
    const related = mockArticles
      .filter(a => a.id !== articleId && a.category === foundArticle.category)
      .slice(0, 3)
    setRelatedArticles(related)
  }, [params.id])

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Artikel wird geladen...</h1>
          </div>
        </div>
      </div>
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link wurde in die Zwischenablage kopiert!')
    }
  }

  // Use semantic theme colors like blog
  const getThemeStyles = () => {
    return {
      page: "min-h-screen bg-background",
      container: "container mx-auto px-4 sm:px-6 lg:px-8 py-8",
      content: "max-w-3xl mx-auto",
      title: "text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6 font-headline",
      summary: "text-xl text-muted-foreground leading-relaxed mb-8",
      authorMeta: "flex items-center gap-4 pb-8 border-b border-border",
      authorName: "font-medium text-foreground",
      metaText: "text-sm text-muted-foreground",
      sectionTitle: "text-2xl font-semibold text-foreground mb-8",
      relatedCard: "group",
      relatedTitle: "text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2",
      relatedSummary: "text-muted-foreground text-sm line-clamp-2 mb-2",
      relatedMeta: "flex items-center text-xs text-muted-foreground"
    };
  };

  const styles = getThemeStyles();

  return (
    <div className={styles.page}>
      {/* Header */}
      <MainNav />
      
      {/* Main Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl max-h-[80vh] overflow-y-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link href="/die-neuen">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 p-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zur Übersicht
                </Button>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-12">
              <ThemedBadge variant="themed" className="mb-4">
                {article.category}
              </ThemedBadge>
              
              <h1 className={styles.title}>
                {article.title}
              </h1>
              
              <p className={styles.summary}>
                {article.summary}
              </p>

              {/* Author and Meta */}
              <div className={styles.authorMeta}>
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className={`flex items-center gap-4 ${styles.metaText}`}>
                    <span className={styles.authorName}>{article.author}</span>
                    <span>·</span>
                    <span>
                      {format(new Date(article.publishedAt), 'dd. MMMM yyyy', { locale: de })}
                    </span>
                    <span>·</span>
                    <span>{article.readTime} Min. Lesezeit</span>
                  </div>
                  <p className={`text-sm text-muted-foreground mt-1`}>Redakteur</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleShare} variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => setIsBookmarked(!isBookmarked)} 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </header>

            {/* Like Button - Top */}
            <div className="flex justify-center mb-8">
              <LikeButton url={`/die-neuen/${article.id}`} initialLikes={article.id === '1' ? 67 : article.id === '2' ? 53 : article.id === '3' ? 41 : article.id === '4' ? 38 : 32} />
            </div>

            {/* Hero Image */}
            <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Content */}
            <article className={styles.content}>
              <div 
                className="prose prose-xl max-w-none text-foreground
                  prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                  prose-p:mb-6 prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:text-lg
                  prose-ul:mb-6 prose-li:mb-2 prose-li:text-muted-foreground prose-li:text-lg
                  prose-ol:mb-6 prose-ol:text-muted-foreground prose-ol:text-lg
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:text-xl prose-blockquote:my-8
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>

            {/* Tags */}
            <div className={`${styles.content} mt-12 pt-8 border-t border-border`}>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Like Button - Bottom */}
            <div className={`${styles.content} mt-12 flex justify-center`}>
              <LikeButton url={`/die-neuen/${article.id}`} initialLikes={article.id === '1' ? 67 : article.id === '2' ? 53 : article.id === '3' ? 41 : article.id === '4' ? 38 : 32} />
            </div>

            {/* Reading Exercise Section */}
            {exercise && (
              <ReadingExerciseComponent exercise={exercise} />
            )}

            {/* Comments Section */}
            <div className={`${styles.content} mt-12`}>
              <Comments url={`/die-neuen/${article.id}`} />
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className={`${styles.content} mt-16 pt-12 border-t border-border`}>
                <h2 className={styles.sectionTitle}>Mehr aus {article.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedArticles.map((related) => (
                    <Link key={related.id} href={`/die-neuen/${related.id}`} className={styles.relatedCard}>
                      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className={styles.relatedTitle}>
                        {related.title}
                      </h3>
                      <p className={styles.relatedSummary}>
                        {related.summary}
                      </p>
                      <div className={styles.relatedMeta}>
                        <span>{format(new Date(related.publishedAt), 'dd.MM.yyyy', { locale: de })}</span>
                        <span className="mx-2">·</span>
                        <span>{related.readTime} Min.</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          {/* Vocabulary Sidebar */}
          <div className="w-80 hidden lg:block">
            <div className="sticky top-[calc(50vh-350px)]">
              <VocabularySidebar />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Vocabulary Toggle */}
      <VocabularyMobileToggle />
      
      {/* Article Completion Tracker */}
      <ArticlePageCompletion articleId={params.id as string} minTimeForCompletion={30} />
    </div>
  )
}

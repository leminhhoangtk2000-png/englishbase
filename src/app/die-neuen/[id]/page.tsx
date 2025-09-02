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
  const [article, setArticle] = useState<any>(null)
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const articleId = params.id as string
    const foundArticle = mockArticles.find(a => a.id === articleId)
    
    if (!foundArticle) {
      notFound()
      return
    }

    setArticle(foundArticle)
    
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MainNav />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/die-neuen">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Article Header */}
              <div className="relative h-96 w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge variant="secondary" className="mb-3 bg-white/90 text-gray-800">
                    {article.category}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {article.title}
                  </h1>
                </div>
              </div>

              {/* Article Meta */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(article.publishedAt), 'dd. MMMM yyyy', { locale: de })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} Min. Lesezeit</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-6">
                  <Button onClick={handleShare} variant="outline" size="sm" className="border-gray-300 text-gray-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Teilen
                  </Button>
                  <Button 
                    onClick={() => setIsBookmarked(!isBookmarked)} 
                    variant={isBookmarked ? "default" : "outline"} 
                    size="sm"
                    className={isBookmarked ? "bg-gray-900 hover:bg-gray-800" : "border-gray-300 text-gray-700"}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    {isBookmarked ? 'Gespeichert' : 'Speichern'}
                  </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Article Summary */}
              <div className="p-8 border-b border-gray-200 bg-gray-50">
                <p className="text-lg text-gray-700 leading-relaxed italic font-light">
                  {article.summary}
                </p>
              </div>

              {/* Article Content */}
              <div className="p-8">
                <div 
                  className="prose prose-lg max-w-none text-gray-800
                    prose-headings:text-gray-900 prose-headings:font-semibold
                    prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                    prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-700
                    prose-ul:mb-4 prose-li:mb-2 prose-li:text-gray-700
                    prose-strong:text-gray-900 prose-strong:font-semibold"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              {/* Article Footer */}
              <div className="p-8 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{article.author}</p>
                      <p className="text-sm text-gray-600">Redakteur</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Kommentare
                  </Button>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Ähnliche Artikel</h3>
                    <div className="space-y-4">
                      {relatedArticles.map((related) => (
                        <Link 
                          key={related.id} 
                          href={`/die-neuen/${related.id}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={related.image}
                                alt={related.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                                {related.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(related.publishedAt), 'dd.MM.yyyy', { locale: de })}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Category Info */}
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Kategorie</h3>
                  <Badge variant="secondary" className="mb-3 bg-gray-100 text-gray-700">
                    {article.category}
                  </Badge>
                  <p className="text-sm text-gray-600 mb-4">
                    Entdecken Sie weitere Artikel aus dieser Kategorie
                  </p>
                  <Link href={`/die-neuen?category=${article.category}`}>
                    <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700">
                      Mehr aus {article.category}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Reading Progress */}
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Lesefortschritt</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lesezeit</span>
                      <span className="text-gray-900 font-medium">{article.readTime} Min.</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-800 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Sie haben etwa 75% des Artikels gelesen
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server';

// Mock detailed article data
const mockArticleDetails = {
  '1': {
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
  },
  '2': {
    id: '2',
    title: 'Neue Studie: Deutsche lernen mehr Fremdsprachen',
    subtitle: 'Besonders Englisch und Spanisch sind beliebt',
    content: `Eine aktuelle Studie des Instituts für Sprachwissenschaft zeigt interessante Entwicklungen beim Fremdsprachenlernen in Deutschland.

Laut der Untersuchung lernen 78% der Deutschen mindestens eine Fremdsprache. Englisch bleibt mit 89% die beliebteste Fremdsprache, gefolgt von Französisch mit 34% und Spanisch mit 28%.

Besonders interessant ist der Anstieg beim Spanischlernen. In den letzten fünf Jahren ist die Zahl der Spanischlerner um 45% gestiegen. "Spanisch wird als Weltsprache immer wichtiger", erklärt Dr. Maria Gonzalez vom Sprachinstitut.

Auch asiatische Sprachen gewinnen an Popularität. Chinesisch und Japanisch verzeichnen einen Zuwachs von 23% bzw. 18%.

Die Studie zeigt auch, dass Online-Lernplattformen immer beliebter werden. 62% der Befragten nutzen Apps oder Websites zum Sprachenlernen.

"Die Digitalisierung verändert das Sprachenlernen grundlegend", so Studienleiter Professor Hans Weber. "Menschen lernen flexibler und individueller als früher."`,
    excerpt: 'Immer mehr Deutsche lernen Fremdsprachen. Englisch bleibt die beliebteste Sprache.',
    category: 'Bildung',
    tags: ['Bildung', 'Sprachen', 'Studie'],
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readTime: 2,
    views: 892,
    likes: 67,
    comments: 8,
    difficulty: 'A2',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=600&fit=crop',
    author: {
      name: 'Bildungsredaktion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bildung'
    },
    vocabulary: [
      { word: 'Untersuchung', translation: 'nghiên cứu, điều tra', example: 'Die Untersuchung zeigt interessante Ergebnisse.' },
      { word: 'Anstieg', translation: 'sự gia tăng', example: 'Es gibt einen Anstieg beim Spanischlernen.' },
      { word: 'Zuwachs', translation: 'sự tăng trưởng', example: 'Die Sprache verzeichnet einen Zuwachs.' },
      { word: 'Befragten', translation: 'người được phỏng vấn', example: '62% der Befragten nutzen Apps.' }
    ]
  },
  '3': {
    id: '3',
    title: 'Berlin: Neues Museum für moderne Kunst eröffnet',
    subtitle: 'Kostenloser Eintritt in der ersten Woche',
    content: `In Berlin-Mitte wurde gestern das neue "Museum für Zeitgenössische Kunst" eröffnet. Das Museum zeigt Werke internationaler Künstler aus den letzten 30 Jahren.

Die Eröffnungsausstellung trägt den Titel "Grenzen überwinden" und präsentiert Kunstwerke aus über 40 Ländern. Zu sehen sind Gemälde, Skulpturen, Videoinstallationen und digitale Kunst.

Museumsdirektorin Dr. Anna Hoffmann erklärt: "Wir wollen Kunst zugänglich machen und Brücken zwischen verschiedenen Kulturen bauen."

Das Museum befindet sich in einem umgebauten Industriegebäude aus dem 19. Jahrhundert. Die Renovierung dauerte drei Jahre und kostete 45 Millionen Euro.

Zur Eröffnungswoche können Besucher das Museum kostenlos besuchen. Danach kostet der Eintritt 12 Euro für Erwachsene, ermäßigt 8 Euro.

Das Museum ist täglich von 10 bis 18 Uhr geöffnet, donnerstags bis 20 Uhr. Es gibt auch spezielle Führungen auf Deutsch, Englisch und Französisch.

Berlins Kultursenator Michael Schmidt lobte das neue Museum: "Berlin stärkt damit seine Position als internationale Kulturmetropole."`,
    excerpt: 'Berlin bekommt ein neues Kunstmuseum. Die Eröffnungswoche ist kostenfrei.',
    category: 'Kultur',
    tags: ['Kultur', 'Berlin', 'Kunst', 'Museum'],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 4,
    views: 567,
    likes: 45,
    comments: 12,
    difficulty: 'B2',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=600&fit=crop',
    author: {
      name: 'Kulturredaktion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kultur'
    },
    vocabulary: [
      { word: 'zeitgenössisch', translation: 'đương đại', example: 'Das Museum zeigt zeitgenössische Kunst.' },
      { word: 'Ausstellung', translation: 'triển lãm', example: 'Die Ausstellung ist sehr interessant.' },
      { word: 'zugänglich', translation: 'dễ tiếp cận', example: 'Kunst soll für alle zugänglich sein.' },
      { word: 'ermäßigt', translation: 'giảm giá', example: 'Studenten zahlen den ermäßigten Preis.' },
      { word: 'Führungen', translation: 'chuyến tham quan có hướng dẫn', example: 'Es gibt Führungen in verschiedenen Sprachen.' }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const article = mockArticleDetails[id as keyof typeof mockArticleDetails];
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Simulate incrementing view count
    article.views += 1;

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

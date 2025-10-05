import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { Footer } from '@/components/footer';
import { TTSProvider } from '@/hooks/use-tts';
import { VocabularyProvider } from '@/hooks/use-vocabulary';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9003'),
  title: {
    default: 'Deutsch.vn - Học tiếng Đức Online',
    template: '%s | Deutsch.vn'
  },
  description: 'Nền tảng học tiếng Đức trực tuyến với từ vựng phân cấp theo CEFR, bài tập thực hành và AI hỗ trợ. Dành cho người Việt học tiếng Đức.',
  keywords: ['học tiếng Đức', 'từ vựng tiếng Đức', 'CEFR', 'A1', 'A2', 'B1', 'B2', 'German learning', 'Vietnamese'],
  authors: [{ name: 'Deutsch.vn Team' }],
  creator: 'Deutsch.vn',
  publisher: 'Deutsch.vn',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/avt.png', sizes: 'any' },
      { url: '/avt.png', sizes: '32x32', type: 'image/png' },
      { url: '/avt.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/avt.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/avt.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://deutsch.vn',
    title: 'Deutsch.vn - Học tiếng Đức Online',
    description: 'Nền tảng học tiếng Đức trực tuyến với từ vựng phân cấp theo CEFR, bài tập thực hành và AI hỗ trợ.',
    siteName: 'Deutsch.vn',
    images: [
      {
        url: '/avt.png',
        width: 1200,
        height: 630,
        alt: 'Deutsch.vn Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deutsch.vn - Học tiếng Đức Online',
    description: 'Nền tảng học tiếng Đức trực tuyến với từ vựng phân cấp theo CEFR.',
    images: ['/avt.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/avt.png" sizes="any" />
        <link rel="apple-touch-icon" href="/avt.png" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
        <script src="/hide-admonitions.js" />
        <script src="/check-dark-mode.js" />
      </head>
      <body className={cn('font-body antialiased flex flex-col min-h-screen')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TTSProvider>
            <VocabularyProvider>
              <AuthProvider>
                <div className="flex-1">{children}</div>
                <Toaster />
                <SonnerToaster />
                <Footer />
              </AuthProvider>
            </VocabularyProvider>
          </TTSProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

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
  title: {
    default: 'Deutsch.vn - Học tiếng Đức Online',
    template: '%s | Deutsch.vn'
  },
  description: 'Nền tảng học tiếng Đức trực tuyến với từ vựng phân cấp theo CEFR, bài tập thực hành và AI hỗ trợ. Dành cho người Việt học tiếng Đức.',
  keywords: ['học tiếng Đức', 'từ vựng tiếng Đức', 'CEFR', 'A1', 'A2', 'B1', 'B2', 'German learning', 'Vietnamese'],
  authors: [{ name: 'Deutsch.vn Team' }],
  creator: 'Deutsch.vn',
  publisher: 'Deutsch.vn',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deutsch.vn - Học tiếng Đức Online',
    description: 'Nền tảng học tiếng Đức trực tuyến với từ vựng phân cấp theo CEFR.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
        <script src="/hide-admonitions.js" />
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

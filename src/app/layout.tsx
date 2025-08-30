import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { Footer } from '@/components/footer';
import { TTSProvider } from '@/hooks/use-tts';
import { VocabularyProvider } from '@/hooks/use-vocabulary';

export const metadata: Metadata = {
  title: 'Deutsch.vn',
  description: 'A modern documentation website built with Next.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased flex flex-col min-h-screen')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          themes={['light', 'dark', 'nude']}
        >
          <TTSProvider>
            <VocabularyProvider>
              <AuthProvider>
                <div className="flex-1">{children}</div>
                <Toaster />
                <Footer />
              </AuthProvider>
            </VocabularyProvider>
          </TTSProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

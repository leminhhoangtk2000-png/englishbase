import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Layers } from 'lucide-react';
import { MainNav } from '@/components/main-nav';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            Modern Documentation, Simplified.
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            DocuNext provides a clean, fast, and organized way to present your project documentation. Built with Next.js for a world-class user experience.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/docs/introduction">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Reading
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com" target="_blank">
                View on GitHub
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold">Features</h2>
              <p className="text-muted-foreground mt-2">Everything you need for a great documentation site.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-md">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
                    <Layers className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">MD & MDX Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Write documentation in Markdown or MDX for rich, interactive content with components.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-md">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">Organized Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A hierarchical system organizes your documents, making it easy for users to find what they need.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-md">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
                    <Search className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">Full-Text Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A powerful search bar allows users to quickly locate information across all documents.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DocuNext. All rights reserved.</p>
      </footer>
    </div>
  );
}

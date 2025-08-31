import EinkaufenTeil1 from '@/content/exercises/a1/einkaufen-teil-1.mdx';

export default function Page() {
  return (
    <main className="container mx-auto max-w-4xl py-6 px-4">
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <a href="/exercises" className="hover:text-foreground transition-colors">Bài tập</a>
          <span className="font-medium text-foreground">/</span>
          <a href="/exercises/a1" className="hover:text-foreground transition-colors">A1</a>
          <span className="font-medium text-foreground">/</span>
          <div className="font-medium text-foreground">Einkaufen Teil 1</div>
        </div>
      </div>
      
      <article className="prose prose-lg prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-h3:font-headline prose-h3:tracking-tight prose-h3:font-semibold prose-h3:text-xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1">
        <EinkaufenTeil1 />
      </article>
    </main>
  );
}

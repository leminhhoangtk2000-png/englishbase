import { notFound } from "next/navigation";
import { getDocFromParams } from "@/lib/blog-new";
import React from "react";
import { Separator } from "@/components/ui/separator";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc || !doc.component) {
    notFound();
  }

  const ContentComponent = doc.component;

  return (
    <main className="relative py-6 lg:py-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="space-y-4 text-center">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl font-headline">{doc.title}</h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">{doc.description}</p>
          )}
        </div>
        <Separator className="my-8" />
        <div className="prose prose-stone dark:prose-invert max-w-none mx-auto prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1">
          <ContentComponent />
        </div>
      </div>
    </main>
  );
}

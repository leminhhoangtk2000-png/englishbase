import { notFound } from "next/navigation";
import { docsConfig } from "@/config/docs";
import { DocsTOC } from "../_components/docs-toc";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || "introduction";
  const doc = docsConfig.items.flatMap(item => item.items ?? []).find(
    (doc) => doc.href?.endsWith(slug)
  );

  if (!doc) {
    return null;
  }

  return doc;
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc || !doc.component) {
    notFound();
  }

  const ContentComponent = doc.component;

  // This is a placeholder for a real TOC generation logic.
  // In a real app, you might parse the component's content to generate this.
  // For now, we'll keep it simple to avoid complex server-side parsing.
  // The client-side `useActiveItem` hook in DocsTOC will work with whatever headings are rendered.
  const toc = {
    items: [
      { title: "Overview", url: "#overview" },
      { title: "Key Features", url: "#key-features" },
      { title: "Getting Help", url: "#getting-help" },
      { title: "Step 1: Clone the Repository", url: "#step-1" },
      { title: "Step 2: Install Dependencies", url: "#step-2" },
      { title: "Step 3: Run the Development Server", url: "#step-3" },
    ],
  };

  return (
    <div className="flex w-full">
      <main className="relative py-6 lg:gap-10 lg:py-8 flex-1">
        <div className="mx-auto w-full min-w-0">
          <div className="space-y-2 mb-8">
            <h1 className="scroll-m-20 text-4xl font-headline font-bold tracking-tight">{doc.title}</h1>
            {doc.description && (
              <p className="text-lg text-muted-foreground">{doc.description}</p>
            )}
          </div>
          <Separator className="my-4 md:my-6" />
          <div className="prose prose-stone dark:prose-invert max-w-none prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1">
            <ContentComponent />
          </div>
        </div>
      </main>
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 lg:sticky lg:block lg:w-[200px]">
        <ScrollArea className="h-full py-6 pr-6 lg:py-8">
          <DocsTOC toc={toc} />
        </ScrollArea>
      </aside>
    </div>
  );
}

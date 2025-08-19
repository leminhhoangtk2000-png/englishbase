import { notFound } from "next/navigation";
import { docsConfig } from "@/config/docs";
import { DocsTOC } from "../_components/docs-toc";
import React from "react";

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

  // Mock TOC for now as we don't have automatic generation from components
  const toc = {
    items: [
      { title: "Overview", url: "#overview" },
      { title: "Key Features", url: "#key-features" },
      { title: "Getting Help", url: "#getting-help" },
    ],
  };

  return (
    <div className="flex w-full">
      <main className="relative py-6 lg:py-8 flex-1">
        <div className="mx-auto w-full min-w-0">
          <article className="prose prose-stone dark:prose-invert max-w-3xl py-6">
            <div className="mb-8">
              <h1 className="font-headline text-4xl font-bold">{doc.title}</h1>
              {doc.description && (
                <p className="text-xl text-muted-foreground">{doc.description}</p>
              )}
            </div>
            <hr className="my-4" />
            <ContentComponent />
          </article>
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

// Dummy ScrollArea component for type consistency, will be removed
const ScrollArea: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

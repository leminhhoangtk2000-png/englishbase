import { notFound } from "next/navigation";
import { getDocFromParams } from "@/lib/exercises";
import { DocsTOC } from "../_components/docs-toc";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ExercisesLandingPage } from "../_components/exercises-landing-page";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

export default async function DocPage({ params }: DocPageProps) {
  // If there's no slug, it's the exercises's main page.
  if (!params.slug || params.slug.length === 0) {
    return <ExercisesLandingPage />;
  }

  const doc = await getDocFromParams({ params });

  if (!doc || !doc.component) {
    notFound();
  }

  const ContentComponent = doc.component;
  const toc = {
    items: [
      { title: "Overview", url: "#overview" },
      { title: "Key Features", url: "#key-features" },
    ],
  };

  return (
    <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-12 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">Bài tập</div>
          <span className="font-medium text-foreground">/</span>
          <div className="font-medium text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">{doc.title}</h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">{doc.description}</p>
          )}
        </div>
        <Separator className="my-4 md:my-6" />
        <div className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1">
          <ContentComponent />
        </div>
      </div>
      <div className="hidden text-sm lg:block">
        <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-y-auto py-12 pl-4">
          <DocsTOC toc={toc} />
        </div>
      </div>
    </main>
  );
}

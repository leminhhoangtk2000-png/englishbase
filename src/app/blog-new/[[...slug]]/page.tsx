import { notFound } from "next/navigation";
import { getDocFromParams } from "@/lib/blog-new";
import { BlogPostPage } from "../_components/blog-post-page";

interface PageProps {
  params: {
    slug: string[];
  };
}

export default async function Page({ params }: PageProps) {
  // If there's no slug, it's the blog's main page.
  if (!params.slug || params.slug.length === 0) {
    return <BlogPostPage />;
  }

  const doc = await getDocFromParams({ params });

  if (!doc || !doc.component) {
    notFound();
  }

  return <BlogPostPage doc={doc} />;
}

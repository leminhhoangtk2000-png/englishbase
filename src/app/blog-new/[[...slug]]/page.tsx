import { notFound } from "next/navigation";
import { getDocFromParams } from "@/lib/blog-new";
import { BlogPostPage } from "../_components/blog-post-page";
import { type NavItemWithComponent } from "@/types";

interface PageProps {
  params: {
    slug: string[];
  };
}

// This is a Server Component
export default async function Page({ params }: PageProps) {
  // If there's no slug, it's the blog's main page.
  if (!params.slug || params.slug.length === 0) {
    return <BlogPostPage />;
  }

  const doc = await getDocFromParams(params.slug);

  if (!doc || !doc.component) {
    notFound();
  }

  // Render the component on the server
  const ContentComponent = doc.component;
  const content = <ContentComponent />;

  // Pass only serializable props to the client component
  const { title, description } = doc;

  return <BlogPostPage title={title} description={description} content={content} />;
}

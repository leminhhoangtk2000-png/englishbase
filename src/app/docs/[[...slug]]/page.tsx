import { notFound } from "next/navigation";
import { getDocBySlug } from "@/lib/docs";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/components/mdx-components";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug || ["introduction"];
  const doc = await getDocBySlug(slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    notFound();
  }

  const components = useMDXComponents({});

  return (
    <article className="prose prose-stone dark:prose-invert max-w-3xl py-6">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{doc.frontmatter.title}</h1>
        {doc.frontmatter.description && (
          <p className="text-xl text-muted-foreground">{doc.frontmatter.description}</p>
        )}
      </div>
      <hr className="my-4"/>
      <MDXRemote source={doc.content} components={components} />
    </article>
  );
}

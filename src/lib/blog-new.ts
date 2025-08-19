import { blogNewConfig } from "@/config/blog-new";
import { type NavItemWithComponent } from "@/types";

interface DocFromParams {
  params: {
    slug: string[];
  };
}

export async function getDocFromParams({ params }: DocFromParams) {
  const slug = params.slug?.join("/") || "introduction";
  const doc = blogNewConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/blog-new/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

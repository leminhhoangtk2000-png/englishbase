import { docsConfig } from "@/config/docs";
import { type NavItemWithComponent } from "@/types";

interface DocFromParams {
  params: {
    slug: string[];
  };
}

export async function getDocFromParams({ params }: DocFromParams) {
  const slug = params.slug?.join("/") || "";
  const doc = docsConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/docs/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

import { examplesConfig } from "@/config/examples";
import { type NavItemWithComponent } from "@/types";

interface DocFromParams {
  params: {
    slug: string[];
  };
}

export async function getDocFromParams({ params }: DocFromParams) {
  const slug = params.slug?.join("/") || "introduction";
  const doc = examplesConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/examples/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

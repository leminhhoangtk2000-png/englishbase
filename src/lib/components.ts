import { componentsConfig } from "@/config/components";
import { type NavItemWithComponent } from "@/types";

interface DocFromParams {
  params: {
    slug: string[];
  };
}

export async function getDocFromParams({ params }: DocFromParams) {
  const slug = params.slug?.join("/") || "";
  const doc = componentsConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/components/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

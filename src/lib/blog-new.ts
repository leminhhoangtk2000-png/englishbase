import { blogNewConfig } from "@/config/blog-new";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = blogNewConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/blog-new/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

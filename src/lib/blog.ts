import { blogConfig } from "@/config/blog";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = blogConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/blog/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

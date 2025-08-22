import { docsConfig } from "@/config/docs";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = docsConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/docs/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

import { docsConfig } from "@/config/a1niveau";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = docsConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/a1niveau/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

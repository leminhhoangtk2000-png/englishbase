import { docsConfig } from "@/config/b2niveau";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = docsConfig.items
    .flatMap((item: any) => item.items ?? [])
    .find((doc: any) => doc.href === `/b2niveau/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

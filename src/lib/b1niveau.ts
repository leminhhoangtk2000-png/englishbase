import { componentsConfig } from "@/config/b1niveau";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = componentsConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/b1niveau/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

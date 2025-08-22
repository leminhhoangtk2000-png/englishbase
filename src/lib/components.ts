import { componentsConfig } from "@/config/components";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = componentsConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/components/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

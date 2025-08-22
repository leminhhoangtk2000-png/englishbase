import { examplesConfig } from "@/config/examples";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = examplesConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/examples/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

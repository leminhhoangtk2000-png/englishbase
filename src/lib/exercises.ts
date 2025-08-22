import { exercisesConfig } from "@/config/exercises";
import { type NavItemWithComponent } from "@/types";

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  const doc = exercisesConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/exercises/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

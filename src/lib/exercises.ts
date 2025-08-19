import { exercisesConfig } from "@/config/exercises";
import { type NavItemWithComponent } from "@/types";

interface DocFromParams {
  params: {
    slug: string[];
  };
}

export async function getDocFromParams({ params }: DocFromParams) {
  const slug = params.slug?.join("/") || "introduction";
  const doc = exercisesConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/exercises/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/exercises/_pages/introduction";
import { InstallationPage } from "@/app/exercises/_pages/installation";

export const exercisesConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Welcome to the exercises section.",
          href: "/exercises/introduction",
          component: IntroductionPage,
        },
        {
          title: "First Exercise",
          description: "This is the first exercise.",
          href: "/exercises/first-exercise",
          component: InstallationPage,
        },
      ],
    },
  ],
};


import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/exercises/_pages/introduction";
import { InstallationPage } from "@/app/exercises/_pages/installation";
import { ExerciseLevelPage } from "@/app/exercises/_components/exercise-level-page";

export const exercisesConfig: DocsConfig = {
  items: [
    {
      title: "Trình độ",
      items: [
        {
          title: "Bài tập A1",
          description: "Danh sách các bài tập cho trình độ A1",
          href: "/exercises/a1",
          component: ExerciseLevelPage,
        },
      ],
    },
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

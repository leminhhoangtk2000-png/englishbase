
import type { DocsConfigWithComponent } from "@/types";
import { IntroductionPage } from "@/app/exercises/_pages/introduction";
import { InstallationPage } from "@/app/exercises/_pages/installation";
import { ExerciseLevelPage } from "@/app/exercises/_components/exercise-level-page";

export const exercisesConfig: DocsConfigWithComponent = {
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
        {
          title: "Bài tập A2",
          description: "Danh sách các bài tập cho trình độ A2",
          href: "/exercises/a2",
          component: ExerciseLevelPage,
        },
        {
          title: "Bài tập B1",
          description: "Danh sách các bài tập cho trình độ B1",
          href: "/exercises/b1",
          component: ExerciseLevelPage,
        },
        {
          title: "Bài tập B2",
          description: "Danh sách các bài tập cho trình độ B2",
          href: "/exercises/b2",
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

import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/blog/_pages/introduction";
import { InstallationPage } from "@/app/blog/_pages/installation";

export const blogConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Welcome to the new blog.",
          href: "/blog/introduction",
          component: IntroductionPage,
        },
        {
          title: "8 Apps to Use Instead of Doomscrolling on Your iPhone",
          description: "How to productively style your screen time",
          href: "/blog/first-post",
          component: InstallationPage,
        },
      ],
    },
  ],
};

import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/blog-new/_pages/introduction";
import { InstallationPage } from "@/app/blog-new/_pages/installation";

export const blogNewConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Welcome to the new blog.",
          href: "/blog-new/introduction",
          component: IntroductionPage,
        },
        {
          title: "First Post",
          description: "This is the first blog post.",
          href: "/blog-new/first-post",
          component: InstallationPage,
        },
      ],
    },
  ],
};

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
          description: "Welcome to the blog.",
          href: "/blog/introduction",
          component: IntroductionPage,
        },
        {
          title: "First Post",
          description: "This is the first blog post.",
          href: "/blog/first-post",
          component: InstallationPage,
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Styling",
          description: "Learn how to customize the look and feel of your documentation site.",
          href: "/blog/core-concepts/styling",
        },
        {
          title: "Search",
          description: "Understand how the full-text search functionality works.",
          href: "/blog/core-concepts/search",
        },
      ],
    },
  ],
};

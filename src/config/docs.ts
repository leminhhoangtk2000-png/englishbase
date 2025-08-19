import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/docs/_pages/introduction";
import { InstallationPage } from "@/app/docs/_pages/installation";

export const docsConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Discover what makes DocuNext the perfect choice for your project documentation.",
          href: "/docs/introduction",
          component: IntroductionPage,
        },
        {
          title: "Installation",
          description: "A step-by-step guide to setting up DocuNext in your project.",
          href: "/docs/installation",
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
          href: "/docs/core-concepts/styling",
          // You would create and import the component here
          // component: StylingPage, 
        },
        {
          title: "Search",
          description: "Understand how the full-text search functionality works.",
          href: "/docs/core-concepts/search",
          // component: SearchPage,
        },
      ],
    },
  ],
};

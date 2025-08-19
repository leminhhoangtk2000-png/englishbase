import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/components/_pages/introduction";
import { InstallationPage } from "@/app/components/_pages/installation";

export const componentsConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Discover our component library.",
          href: "/components/introduction",
          component: IntroductionPage,
        },
        {
          title: "Installation",
          description: "How to install and use the components.",
          href: "/components/installation",
          component: InstallationPage,
        },
      ],
    },
    {
      title: "Component List",
      items: [
        {
          title: "Buttons",
          description: "A collection of button components.",
          href: "/components/list/buttons",
        },
        {
          title: "Cards",
          description: "Card components for displaying content.",
          href: "/components/list/cards",
        },
      ],
    },
  ],
};

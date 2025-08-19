import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/examples/_pages/introduction";
import { InstallationPage } from "@/app/examples/_pages/installation";

export const examplesConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Browse our application examples.",
          href: "/examples/introduction",
          component: IntroductionPage,
        },
        {
          title: "Dashboard Example",
          description: "A full dashboard layout example.",
          href: "/examples/dashboard",
          component: InstallationPage,
        },
      ],
    },
    {
      title: "Authentication",
      items: [
        {
          title: "Login Page",
          description: "An example of a login page.",
          href: "/examples/auth/login",
        },
        {
          title: "Sign-up Form",
          description: "An example of a sign-up form.",
          href: "/examples/auth/signup",
        },
      ],
    },
  ],
};

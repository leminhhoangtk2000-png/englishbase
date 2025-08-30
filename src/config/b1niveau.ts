import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/b1niveau/_pages/introduction";
import { InstallationPage } from "@/app/b1niveau/_pages/installation";

export const componentsConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Khám phá ngữ pháp B1.",
          href: "/b1niveau/introduction",
          component: IntroductionPage,
        },
        {
          title: "Installation",
          description: "Cách cài đặt và sử dụng các thành phần B1.",
          href: "/b1niveau/installation",
          component: InstallationPage,
        },
      ],
    },
    {
      title: "Component List",
      items: [
        {
          title: "Buttons",
          description: "Bộ sưu tập các thành phần nút.",
          href: "/b1niveau/list/buttons",
        },
        {
          title: "Cards",
          description: "Thành phần thẻ để hiển thị nội dung.",
          href: "/b1niveau/list/cards",
        },
      ],
    },
  ],
};

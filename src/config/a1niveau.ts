import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/a1niveau/_pages/introduction";
import { InstallationPage } from "@/app/a1niveau/_pages/installation";

export const docsConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Khám phá ngữ pháp tiếng Đức cấp độ A1.",
          href: "/a1niveau/introduction",
          component: IntroductionPage,
        },
        {
          title: "Installation",
          description: "Hướng dẫn từng bước để thiết lập môi trường học A1.",
          href: "/a1niveau/installation",
          component: InstallationPage,
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Styling",
          description: "Học cách tùy chỉnh giao diện trang tài liệu.",
          href: "/a1niveau/core-concepts/styling",
          // You would create and import the component here
          // component: StylingPage, 
        },
        {
          title: "Search",
          description: "Hiểu cách hoạt động của chức năng tìm kiếm toàn văn.",
          href: "/a1niveau/core-concepts/search",
          // component: SearchPage,
        },
      ],
    },
  ],
};

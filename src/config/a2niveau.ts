import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/a2niveau/_pages/introduction";
import { InstallationPage } from "@/app/a2niveau/_pages/installation";

export const blogConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Chào mừng đến với ngữ pháp A2.",
          href: "/a2niveau/introduction",
          component: IntroductionPage,
        },
        {
          title: "First Post",
          description: "Bài học đầu tiên về ngữ pháp A2.",
          href: "/a2niveau/first-post",
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
          href: "/a2niveau/core-concepts/styling",
        },
        {
          title: "Search",
          description: "Hiểu cách hoạt động của chức năng tìm kiếm toàn văn.",
          href: "/a2niveau/core-concepts/search",
        },
      ],
    },
  ],
};

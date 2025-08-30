import type { DocsConfig } from "@/types";
import { IntroductionPage } from "@/app/b2niveau/_pages/introduction";
import { InstallationPage } from "@/app/b2niveau/_pages/installation";

export const examplesConfig: DocsConfig = {
  items: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          description: "Duyệt qua các ví dụ ứng dụng B2.",
          href: "/b2niveau/introduction",
          component: IntroductionPage,
        },
        {
          title: "Dashboard Example",
          description: "Ví dụ về bố cục bảng điều khiển đầy đủ.",
          href: "/b2niveau/dashboard",
          component: InstallationPage,
        },
      ],
    },
    {
      title: "Authentication",
      items: [
        {
          title: "Login Page",
          description: "Ví dụ về trang đăng nhập.",
          href: "/b2niveau/auth/login",
        },
        {
          title: "Sign-up Form",
          description: "Ví dụ về biểu mẫu đăng ký.",
          href: "/b2niveau/auth/signup",
        },
      ],
    },
  ],
};

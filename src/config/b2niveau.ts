import type { DocsConfig } from "@/types";
import { getNavigationStructure } from "@/lib/markdown";

// Get dynamic navigation from markdown files
const markdownNavigation = getNavigationStructure('b2niveau');

export const docsConfig: DocsConfig = {
  items: markdownNavigation.length > 0 ? markdownNavigation : [
    {
      title: "Ngữ pháp - Grammatik",
      items: [
        {
          title: "Câu gián tiếp - Indirekte Rede",
          description: "Học cách chuyển đổi lời nói trực tiếp thành gián tiếp",
          href: "/b2niveau/grammatik/01-indirekte-rede",
        },
        {
          title: "Liên từ phức tạp - Konnektoren",
          description: "Sử dụng các liên từ phức tạp trong câu",
          href: "/b2niveau/grammatik/02-konnektoren",
        },
        {
          title: "Cách dùng 'haben zu/sein zu' - Modalverben Alternativen",
          description: "Các cấu trúc thay thế cho động từ khuyết thiếu",
          href: "/b2niveau/grammatik/03-modalverben-alternativen",
        },
        {
          title: "Phân từ - Partizipialkonstruktionen",
          description: "Cấu trúc phân từ trong tiếng Đức",
          href: "/b2niveau/grammatik/04-partizipialkonstruktionen",
        },
      ],
    },
    {
      title: "Từ vựng - Wortschatz",
      items: [
        {
          title: "Kinh tế - Wirtschaft",
          description: "Từ vựng về kinh tế và kinh doanh",
          href: "/b2niveau/wortschatz/01-wirtschaft",
        },
        {
          title: "Chính trị - Politik",
          description: "Từ vựng về chính trị và xã hội",
          href: "/b2niveau/wortschatz/02-politik",
        },
        {
          title: "Khoa học - Wissenschaft",
          description: "Từ vựng về khoa học và công nghệ",
          href: "/b2niveau/wortschatz/03-wissenschaft",
        },
        {
          title: "Văn hóa - Kultur",
          description: "Từ vựng về văn hóa và nghệ thuật",
          href: "/b2niveau/wortschatz/04-kultur",
        },
      ],
    },
    {
      title: "Bài tập - Übungen",
      items: [
        {
          title: "Luyện ngữ pháp B2",
          description: "Bài tập thực hành ngữ pháp cấp độ B2",
          href: "/b2niveau/uebungen/01-grammatik-uebungen",
        },
        {
          title: "Luyện từ vựng B2",
          description: "Bài tập thực hành từ vựng cấp độ B2",
          href: "/b2niveau/uebungen/02-wortschatz-uebungen",
        },
        {
          title: "Luyện viết B2",
          description: "Bài tập thực hành viết cấp độ B2",
          href: "/b2niveau/uebungen/03-schreiben-uebungen",
        },
      ],
    },
  ],
};

// Keep backwards compatibility
export const b2niveauConfig = {
  sidebarNav: docsConfig.items,
};

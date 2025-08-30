import type { DocsConfig } from "@/types";
import { getNavigationStructure } from "@/lib/markdown";

// Get dynamic navigation from markdown files
const markdownNavigation = getNavigationStructure('b1niveau');

export const docsConfig: DocsConfig = {
  items: markdownNavigation.length > 0 ? markdownNavigation : [
    {
      title: "Ngữ pháp - Grammatik",
      items: [
        {
          title: "Thì hoàn thành - Perfekt",
          description: "Học cách sử dụng thì hoàn thành trong tiếng Đức",
          href: "/b1niveau/grammatik/01-perfekt",
        },
        {
          title: "Quá khứ đơn - Präteritum",
          description: "Sử dụng thì quá khứ đơn trong văn viết",
          href: "/b1niveau/grammatik/02-praeteritum",
        },
        {
          title: "Câu điều kiện - Konjunktiv II",
          description: "Học cách sử dụng câu điều kiện và lời khuyên",
          href: "/b1niveau/grammatik/03-konjunktiv-ii",
        },
        {
          title: "Câu bị động - Passiv",
          description: "Cấu trúc câu bị động trong tiếng Đức",
          href: "/b1niveau/grammatik/04-passiv",
        },
      ],
    },
    {
      title: "Từ vựng - Wortschatz",
      items: [
        {
          title: "Công việc - Arbeit",
          description: "Từ vựng về công việc và nghề nghiệp",
          href: "/b1niveau/wortschatz/01-arbeit",
        },
        {
          title: "Sức khỏe - Gesundheit",
          description: "Từ vựng về sức khỏe và y tế",
          href: "/b1niveau/wortschatz/02-gesundheit",
        },
        {
          title: "Giáo dục - Bildung",
          description: "Từ vựng về giáo dục và học tập",
          href: "/b1niveau/wortschatz/03-bildung",
        },
        {
          title: "Đi lại - Verkehr",
          description: "Từ vựng về giao thông và đi lại",
          href: "/b1niveau/wortschatz/04-verkehr",
        },
      ],
    },
    {
      title: "Bài tập - Übungen",
      items: [
        {
          title: "Luyện ngữ pháp B1",
          description: "Bài tập thực hành ngữ pháp cấp độ B1",
          href: "/b1niveau/uebungen/01-grammatik-uebungen",
        },
        {
          title: "Luyện từ vựng B1",
          description: "Bài tập thực hành từ vựng cấp độ B1",
          href: "/b1niveau/uebungen/02-wortschatz-uebungen",
        },
        {
          title: "Luyện đọc B1",
          description: "Bài tập thực hành đọc hiểu cấp độ B1",
          href: "/b1niveau/uebungen/03-lesen-uebungen",
        },
      ],
    },
  ],
};

// Keep backwards compatibility
export const b1niveauConfig = {
  sidebarNav: docsConfig.items,
};

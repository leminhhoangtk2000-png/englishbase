import type { DocsConfig } from "@/types";
import { getNavigationStructure } from "@/lib/markdown";

// Get dynamic navigation from markdown files
const markdownNavigation = getNavigationStructure('a1niveau');

export const docsConfig: DocsConfig = {
  items: markdownNavigation.length > 0 ? markdownNavigation : [
    {
      title: "Ngữ pháp - Grammatik",
      items: [
        {
          title: "Chia động từ hiện tại",
          description: "Học cách chia động từ trong tiếng Đức ở thì hiện tại",
          href: "/a1niveau/grammatik/01-chia-dong-tu-hien-tai",
        },
        {
          title: "Thị động từ Modal Verben",
          description: "Học cách sử dụng các động từ tình thái",
          href: "/a1niveau/grammatik/02-modal-verben",
        },
      ],
    },
    {
      title: "Từ vựng - Wortschatz",
      items: [
        {
          title: "Gia đình - Familie",
          description: "Học từ vựng về gia đình trong tiếng Đức",
          href: "/a1niveau/wortschatz/01-familie",
        },
      ],
    },
  ],
};

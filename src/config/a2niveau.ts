import type { DocsConfig } from "@/types";
import { getNavigationStructure } from "@/lib/markdown";

// Get dynamic navigation from markdown files
const markdownNavigation = getNavigationStructure('a2niveau');

export const blogConfig: DocsConfig = {
  items: markdownNavigation.length > 0 ? markdownNavigation : [
    {
      title: "Ngữ pháp - Grammatik",
      items: [
        {
          title: "Quá khứ đơn - Präteritum",
          description: "Học cách sử dụng thì quá khứ đơn trong tiếng Đức",
          href: "/a2niveau/grammatik/01-praeteritum",
        },
      ],
    },
  ],
};

import type { DocsConfig } from "@/types";
import { getNavigationStructure } from "@/lib/markdown";

// Get dynamic navigation from markdown files
const markdownNavigation = getNavigationStructure('a1niveau');

export const docsConfig: DocsConfig = {
  items: markdownNavigation.length > 0 ? markdownNavigation : [
    {
      title: "Grammatik",
      href: "/a1niveau/grammatik",
      items: [
        {
          title: "Chia động từ ở thì hiện tại - Präsens",
          description: "Học cách chia động từ trong tiếng Đức ở thì hiện tại (Präsens) với đầy đủ quy tắc và ví dụ",
          href: "/a1niveau/grammatik/01-prasens",
        },
        {
          title: "Artikel und Nomen - Khái niệm về Quán từ",
          description: "Tìm hiểu về quán từ và danh từ trong tiếng Đức, bao gồm der/die/das và các quy tắc xác định giống",
          href: "/a1niveau/grammatik/02-artikel-nomen",
        },
        {
          title: "W-Fragen und Ja/Nein-Fragen",
          description: "Học cách đặt câu hỏi trong tiếng Đức với W-Fragen và Ja/Nein-Fragen",
          href: "/a1niveau/grammatik/03-wfragen",
        },
        {
          title: "Kasus - Nominativ, Akkusativ, Dativ",
          description: "Tìm hiểu về các cách (Kasus) trong tiếng Đức: Nominativ, Akkusativ và Dativ",
          href: "/a1niveau/grammatik/04-kasus",
        },
        {
          title: "Modalverben - Động từ khuyết thiếu",
          description: "Tìm hiểu về các động từ khuyết thiếu (Modalverben) trong tiếng Đức: können, müssen, wollen, sollen, dürfen, mögen",
          href: "/a1niveau/grammatik/05-modalverben",
        },
        {
          title: "Trennbare Verben - Động từ tách được",
          description: "Học về động từ tách được và không tách được trong tiếng Đức",
          href: "/a1niveau/grammatik/06-trennbare-verben",
        },
        {
          title: "Imperativ - Câu mệnh lệnh",
          description: "Tìm hiểu cách tạo và sử dụng câu mệnh lệnh (Imperativ) trong tiếng Đức",
          href: "/a1niveau/grammatik/07-imperativ",
        },
        {
          title: "Präpositionen - Giới từ",
          description: "Học về giới từ trong tiếng Đức và cách sử dụng với các Kasus khác nhau",
          href: "/a1niveau/grammatik/08-prapositionen",
        },
        {
          title: "Negation - Phủ định với nicht và kein",
          description: "Tìm hiểu cách phủ định trong tiếng Đức với nicht và kein",
          href: "/a1niveau/grammatik/09-negation",
        },
        {
          title: "Konjunktionen - Liên từ",
          description: "Học về các liên từ kết nối mệnh đề trong tiếng Đức",
          href: "/a1niveau/grammatik/10-konjunktionen",
        },
        {
          title: "Quán từ nâng cao - Erweiterter Wortschatz",
          description: "Mở rộng kiến thức về quán từ và từ vựng nâng cao trong tiếng Đức",
          href: "/a1niveau/grammatik/11-quan-tu-nang-cao",
        },
        {
          title: "Personalpronomen - Đại từ nhân xưng",
          description: "Tìm hiểu về đại từ nhân xưng trong tiếng Đức và cách chia theo các Kasus",
          href: "/a1niveau/grammatik/12-personalpronomen",
        },
        {
          title: "Demo: Docusaurus Features",
          description: "Minh họa tất cả tính năng markdown nâng cao như Docusaurus",
          href: "/a1niveau/grammatik/demo-docusaurus-features",
        },
      ],
    },
  ],
};

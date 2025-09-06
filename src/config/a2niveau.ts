import type { DocsConfig } from "@/types";
import { getNavigationStructure } from "@/lib/markdown";

// Get dynamic navigation from markdown files
const markdownNavigation = getNavigationStructure('a2niveau');

export const docsConfig: DocsConfig = {
  items: markdownNavigation.length > 0 ? markdownNavigation : [
    {
      title: "Grammatik",
      href: "/a2niveau/grammatik",
      items: [
        {
          title: "A2 Niveau - Grammatik",
          description: "Các bài học ngữ pháp tiếng Đức cấp độ A2 - Từ cơ bản đến nâng cao",
          href: "/a2niveau/grammatik/index",
        },
        {
          title: "Perfekt - Thì quá khứ hoàn thành",
          description: "Học cách sử dụng thì Perfekt trong tiếng Đức với haben và sein",
          href: "/a2niveau/grammatik/01-perfekt",
        },
        {
          title: "Präteritum - Thì quá khứ đơn",
          description: "Tìm hiểu về thì Präteritum và cách chia động từ ở thì quá khứ",
          href: "/a2niveau/grammatik/02-prateritum",
        },
        {
          title: "Adjektivdeklination - Chia tính từ",
          description: "Học cách chia tính từ theo các Kasus và quán từ",
          href: "/a2niveau/grammatik/03-adjektivdeklination",
        },
        {
          title: "Komparativ und Superlativ - So sánh",
          description: "Tìm hiểu về so sánh hơn và so sánh nhất trong tiếng Đức",
          href: "/a2niveau/grammatik/04-komparativ-superlativ",
        },
        {
          title: "Reflexivverben - Động từ phản thân",
          description: "Học về động từ phản thân và cách sử dụng đại từ phản thân",
          href: "/a2niveau/grammatik/05-reflexivverben",
        },
        {
          title: "Konjunktiv II - Thể giả định",
          description: "Tìm hiểu về thể giả định Konjunktiv II và cách sử dụng",
          href: "/a2niveau/grammatik/06-konjunktiv-ii",
        },
        {
          title: "Passiv - Câu bị động",
          description: "Học cách tạo và sử dụng câu bị động trong tiếng Đức",
          href: "/a2niveau/grammatik/07-passiv",
        },
        {
          title: "Nebensätze - Mệnh đề phụ",
          description: "Tìm hiểu về các loại mệnh đề phụ và cách kết nối",
          href: "/a2niveau/grammatik/08-nebensatze",
        },
      ],
    },
    {
      title: "Wortschatz",
      href: "/a2niveau/wortschatz",
      items: [
        {
          title: "Familie und Beziehungen",
          description: "Từ vựng về gia đình và các mối quan hệ",
          href: "/a2niveau/wortschatz/01-familie",
        },
        {
          title: "Wohnen und Haushalt",
          description: "Từ vựng về nhà ở và việc nhà",
          href: "/a2niveau/wortschatz/02-wohnen",
        },
        {
          title: "Gesundheit und Körper",
          description: "Từ vựng về sức khỏe và cơ thể",
          href: "/a2niveau/wortschatz/03-gesundheit",
        },
      ],
    },
  ],
};

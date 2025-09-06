import type { DocsConfig } from "@/types";
import { getNavigationStructure } from "@/lib/markdown";

// Get dynamic navigation from markdown files
const markdownNavigation = getNavigationStructure('a2niveau');

export const docsConfig: DocsConfig = {
  items: [
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
          title: "Adjektivdeklination - Chia đuôi tính từ",
          description: "Học cách chia đuôi tính từ trong tiếng Đức theo các Kasus và quán từ",
          href: "/a2niveau/grammatik/02-adjektivdeklination",
        },
        {
          title: "Komparativ und Superlativ - So sánh hơn và so sánh nhất",
          description: "Học cách so sánh bằng, so sánh hơn và so sánh nhất trong tiếng Đức",
          href: "/a2niveau/grammatik/03-komparativ-superlativ",
        },
        {
          title: "Perfekt - Thì quá khứ hoàn thành (Chi tiết)",
          description: "Hướng dẫn chi tiết về thì Perfekt trong tiếng Đức với haben và sein",
          href: "/a2niveau/grammatik/04-perfekt-advanced",
        },
        {
          title: "Präteritum - Thì quá khứ đơn",
          description: "Học cách sử dụng thì Präteritum trong tiếng Đức",
          href: "/a2niveau/grammatik/05-prateritum",
        },
        {
          title: "Plusquamperfekt - Thì quá khứ hoàn thành trước",
          description: "Học cách sử dụng thì Plusquamperfekt trong tiếng Đức",
          href: "/a2niveau/grammatik/06-plusquamperfekt",
        },
        {
          title: "Die Nebensätze - Các loại câu phụ",
          description: "Học về các loại mệnh đề phụ trong tiếng Đức",
          href: "/a2niveau/grammatik/07-nebensatze",
        },
        {
          title: "Passiv - Thể bị động",
          description: "Học cách tạo và sử dụng câu bị động trong tiếng Đức",
          href: "/a2niveau/grammatik/08-passiv",
        },
        {
          title: "Das Futur I & Futur II - Thì tương lai",
          description: "Học về thì tương lai đơn và tương lai hoàn thành trong tiếng Đức",
          href: "/a2niveau/grammatik/09-futur",
        },
        {
          title: "Passiv Alternativen - Dạng thay thế bị động",
          description: "Học các dạng thay thế của thể bị động trong tiếng Đức",
          href: "/a2niveau/grammatik/10-passiv-alternativen",
        },
        {
          title: "Die Possessivpronomen - Đại từ sở hữu",
          description: "Học về đại từ sở hữu trong tiếng Đức",
          href: "/a2niveau/grammatik/11-possessivpronomen",
        },
        {
          title: "Reflexivpronomen - Đại từ phản thân",
          description: "Học về đại từ phản thân và động từ phản thân",
          href: "/a2niveau/grammatik/12-reflexivpronomen",
        },
        {
          title: "Genitiv - Cách sở hữu",
          description: "Học về cách sở hữu Genitiv trong tiếng Đức",
          href: "/a2niveau/grammatik/13-genitiv",
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

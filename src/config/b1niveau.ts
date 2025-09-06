import type { DocsConfig } from "@/types";
import { getNavigationStructure } from "@/lib/markdown";

// Get dynamic navigation from markdown files
const markdownNavigation = getNavigationStructure('b1niveau');

export const docsConfig: DocsConfig = {
  items: markdownNavigation.length > 0 ? markdownNavigation : [
    {
      title: "Grammatik",
      href: "/b1niveau/grammatik",
      items: [
        {
          title: "B1 Niveau - Grammatik",
          description: "Các bài học ngữ pháp tiếng Đức cấp độ B1 - Từ trung cấp đến nâng cao",
          href: "/b1niveau/grammatik/index",
        },
        {
          title: "Plusquamperfekt - Thì quá khứ hoàn thành",
          description: "Học cách sử dụng thì Plusquamperfekt trong tiếng Đức",
          href: "/b1niveau/grammatik/01-plusquamperfekt",
        },
        {
          title: "Futur I und II - Thì tương lai",
          description: "Tìm hiểu về thì tương lai I và II trong tiếng Đức",
          href: "/b1niveau/grammatik/02-futur",
        },
        {
          title: "Konjunktiv I - Thể tường thuật",
          description: "Học cách sử dụng Konjunktiv I cho lời tường thuật",
          href: "/b1niveau/grammatik/03-konjunktiv-i",
        },
        {
          title: "Relativsätze - Mệnh đề quan hệ",
          description: "Tìm hiểu về mệnh đề quan hệ và đại từ quan hệ",
          href: "/b1niveau/grammatik/04-relativsatze",
        },
        {
          title: "Partizipien - Phân từ",
          description: "Học về phân từ I và phân từ II trong tiếng Đức",
          href: "/b1niveau/grammatik/05-partizipien",
        },
        {
          title: "Infinitivsätze - Mệnh đề nguyên thể",
          description: "Tìm hiểu về mệnh đề nguyên thể với zu",
          href: "/b1niveau/grammatik/06-infinitivsatze",
        },
        {
          title: "Subjektive Modalverben - Động từ tình thái chủ quan",
          description: "Học cách sử dụng động từ tình thái để diễn tả suy đoán",
          href: "/b1niveau/grammatik/07-subjektive-modalverben",
        },
        {
          title: "Nominalisierung - Danh từ hóa",
          description: "Tìm hiểu về quá trình danh từ hóa trong tiếng Đức",
          href: "/b1niveau/grammatik/08-nominalisierung",
        },
      ],
    },
    {
      title: "Wortschatz",
      href: "/b1niveau/wortschatz",
      items: [
        {
          title: "Beruf und Karriere",
          description: "Từ vựng về nghề nghiệp và sự nghiệp",
          href: "/b1niveau/wortschatz/01-beruf",
        },
        {
          title: "Medien und Kommunikation",
          description: "Từ vựng về truyền thông và giao tiếp",
          href: "/b1niveau/wortschatz/02-medien",
        },
        {
          title: "Umwelt und Natur",
          description: "Từ vựng về môi trường và thiên nhiên",
          href: "/b1niveau/wortschatz/03-umwelt",
        },
        {
          title: "Politik und Gesellschaft",
          description: "Từ vựng về chính trị và xã hội",
          href: "/b1niveau/wortschatz/04-politik",
        },
      ],
    },
  ],
};

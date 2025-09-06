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
          title: "N-Deklination - Biến cách danh từ yếu",
          description: "Tìm hiểu về nhóm danh từ yếu (N-Deklination) trong tiếng Đức và cách biến đổi theo cách",
          href: "/b1niveau/grammatik/01-n-deklination",
        },
        {
          title: "Relativsätze - Câu quan hệ",
          description: "Học cách sử dụng đại từ quan hệ và câu quan hệ trong tiếng Đức",
          href: "/b1niveau/grammatik/02-relativsatze",
        },
        {
          title: "Doppelkonjunktionen - Liên từ đôi",
          description: "Tìm hiểu về liên từ đôi trong tiếng Đức và cách sử dụng chúng",
          href: "/b1niveau/grammatik/03-doppelkonjunktionen",
        },
        {
          title: "Verben und Adjektive mit Präpositionen",
          description: "Học các động từ và tính từ đi kèm với giới từ trong tiếng Đức",
          href: "/b1niveau/grammatik/04-verben-adjektiv-mit-praeposition",
        },
        {
          title: "Konjunktiv II - Thể giả định loại hai",
          description: "Tìm hiểu về thể giả định Konjunktiv II và cách sử dụng trong tiếng Đức",
          href: "/b1niveau/grammatik/05-konjunktiv-ii",
        },
        {
          title: "Động từ lassen, brauchen và werden",
          description: "Tìm hiểu về cách sử dụng đặc biệt của các động từ lassen, brauchen và werden",
          href: "/b1niveau/grammatik/06-lassen-brauchen-werden",
        },
        {
          title: "Wortstellung - Trật tự từ trong tiếng Đức",
          description: "Học các quy tắc sắp xếp từ trong câu tiếng Đức",
          href: "/b1niveau/grammatik/07-wortstellung",
        },
        {
          title: "Các cặp từ dễ nhầm lẫn - Phần 1",
          description: "Phân biệt các từ và cụm từ dễ nhầm lẫn trong tiếng Đức",
          href: "/b1niveau/grammatik/08-verwechselbare-worter-teil1",
        },
        {
          title: "Các cặp từ dễ nhầm lẫn - Phần 2",
          description: "Tiếp tục phân biệt các từ và cụm từ dễ nhầm lẫn trong tiếng Đức",
          href: "/b1niveau/grammatik/09-verwechselbare-worter-teil2",
        },
        {
          title: "Các cặp từ dễ nhầm lẫn - Phần 3",
          description: "Phần 3 về các từ và cụm từ dễ nhầm lẫn trong tiếng Đức",
          href: "/b1niveau/grammatik/10-verwechselbare-worter-teil3",
        },
        {
          title: "Các cặp từ dễ nhầm lẫn - Phần 4",
          description: "Phần cuối về các từ và cụm từ dễ nhầm lẫn trong tiếng Đức",
          href: "/b1niveau/grammatik/11-verwechselbare-worter-teil4",
        },
        {
          title: "Partizip I & Partizip II",
          description: "Tìm hiểu về phân từ loại 1 và phân từ loại 2 trong tiếng Đức",
          href: "/b1niveau/grammatik/12-partizip-i-ii",
        },
        {
          title: "Konjunktiv I - Thể giả định loại một",
          description: "Tìm hiểu về thể giả định Konjunktiv I và cách sử dụng trong lời nói gián tiếp",
          href: "/b1niveau/grammatik/13-konjunktiv-i",
        },
        {
          title: "Câu với 'zu + Infinitiv' và 'um... zu'",
          description: "Học cách sử dụng cấu trúc zu + Infinitiv và um... zu trong tiếng Đức",
          href: "/b1niveau/grammatik/14-zu-infinitiv-um-zu",
        },
        {
          title: "Verben mit festen Präpositionen",
          description: "Học các động từ đi với giới từ cố định trong tiếng Đức",
          href: "/b1niveau/grammatik/15-verben-mit-festen-praeposition",
        },
        {
          title: "Adjektiv mit Präposition",
          description: "Học các tính từ đi với giới từ trong tiếng Đức",
          href: "/b1niveau/grammatik/16-adjektiv-mit-praeposition",
        },
        {
          title: "Verben mit zwei Objekten",
          description: "Học về động từ với hai tân ngữ trong tiếng Đức",
          href: "/b1niveau/grammatik/17-verben-mit-zwei-objekten",
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

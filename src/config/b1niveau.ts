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
      title: "Vokabular",
      href: "/b1niveau/vokabular",
      items: [
        {
          title: "1. Körperteile",
          description: "Từ vựng về các bộ phận cơ thể",
          href: "/b1niveau/vokabular/1-koerperteile",
        },
        {
          title: "2. Zeitpunkt",
          description: "Từ vựng về thời gian và cảm giác thời gian",
          href: "/b1niveau/vokabular/2-zeitpunkt",
        },
        {
          title: "3. Das ist mir aber peinlich",
          description: "Từ vựng về cảm xúc xấu hổ và tình huống khó xử",
          href: "/b1niveau/vokabular/3-das-ist-mir-aber-peinlich",
        },
        {
          title: "4. Priorität 1",
          description: "Từ vựng ưu tiên cấp độ 1",
          href: "/b1niveau/vokabular/4-prioritaet-1",
        },
        {
          title: "5. Migration",
          description: "Từ vựng về di cư và hội nhập",
          href: "/b1niveau/vokabular/5-migration",
        },
        {
          title: "6. Alltag",
          description: "Từ vựng về cuộc sống hàng ngày",
          href: "/b1niveau/vokabular/6-alltag",
        },
        {
          title: "7. Europa",
          description: "Từ vựng về châu Âu và văn hóa",
          href: "/b1niveau/vokabular/7-europa",
        },
        {
          title: "8. Frauen & Männer",
          description: "Từ vựng về giới tính và vai trò xã hội",
          href: "/b1niveau/vokabular/8-frauen-maenner",
        },
        {
          title: "9. Priorität 2",
          description: "Từ vựng ưu tiên cấp độ 2",
          href: "/b1niveau/vokabular/9-prioritaet-2",
        },
        {
          title: "10. Arbeit im Wandel",
          description: "Từ vựng về sự thay đổi trong công việc",
          href: "/b1niveau/vokabular/10-arbeit-im-wandel",
        },
        {
          title: "11. Klima und Umwelt",
          description: "Từ vựng về khí hậu và môi trường",
          href: "/b1niveau/vokabular/11-klima-und-unwelt",
        },
        {
          title: "12. Schule und Lernen",
          description: "Từ vựng về trường học và việc học",
          href: "/b1niveau/vokabular/12-schule-und-lernen",
        },
      ],
    },
    {
      title: "Vokabular Thema",
      href: "/b1niveau/vokabular-thema",
      items: [
        {
          title: "200 phổ biến Adjektiv",
          description: "200 tính từ phổ biến nhất trong tiếng Đức B1",
          href: "/b1niveau/vokabular-thema/200-adj-pho-bien-b1",
        },
        {
          title: "200 phổ biến Adverb",
          description: "200 trạng từ phổ biến nhất trong tiếng Đức B1", 
          href: "/b1niveau/vokabular-thema/200-adv-pho-bien-b1",
        },
        {
          title: "200 phổ biến Verb",
          description: "200 động từ phổ biến nhất trong tiếng Đức B1",
          href: "/b1niveau/vokabular-thema/200-verb-pho-bien-b1",
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

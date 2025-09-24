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
          items: [
            {
              title: "Der Kopf",
              description: "Từ vựng về đầu và khuôn mặt",
              href: "/b1niveau/vokabular/1-koerperteile/01-der-kopf",
            },
            {
              title: "Oberkörper - Unterkörper",
              description: "Từ vựng về thân trên - thân dưới",
              href: "/b1niveau/vokabular/1-koerperteile/02-oberkoerper-unterkoerper",
            },
            {
              title: "Innere Organe",
              description: "Từ vựng về các cơ quan nội tạng",
              href: "/b1niveau/vokabular/1-koerperteile/03-innere-organe",
            },
          ],
        },
        {
          title: "2. Zeitpunkt",
          description: "Từ vựng về thời gian và cảm giác thời gian",
          href: "/b1niveau/vokabular/2-zeitpunkt",
          items: [
            {
              title: "Zeitgefühl - gefühlte Zeit",
              description: "Cảm giác về thời gian",
              href: "/b1niveau/vokabular/2-zeitpunkt/01-zeitgefuehl-gefuehlte-zeit",
            },
            {
              title: "Wo bleibt die Zeit",
              description: "Thời gian đâu rồi",
              href: "/b1niveau/vokabular/2-zeitpunkt/02-wo-bleibt-die-zeit",
            },
            {
              title: "Die Zeitgeschichte",
              description: "Lịch sử thời gian",
              href: "/b1niveau/vokabular/2-zeitpunkt/03-die-zeitgeschichte",
            },
            {
              title: "Nachdenken über Zeit",
              description: "Suy nghĩ về thời gian",
              href: "/b1niveau/vokabular/2-zeitpunkt/04-nachdenken-ueber-zeit",
            },
            {
              title: "Übung (Zeitpunkt)",
              description: "Bài tập về thời gian",
              href: "/b1niveau/vokabular/2-zeitpunkt/05-uebung-zeitpunkt",
            },
            {
              title: "Tổng hợp động từ và tính từ bài 2",
              description: "Tổng hợp từ vựng bài 2",
              href: "/b1niveau/vokabular/2-zeitpunkt/tong-hop-dong-tu-va-tinh-tu-bai-2",
            },
          ],
        },
        {
          title: "3. Das ist mir aber peinlich",
          description: "Từ vựng về cảm xúc xấu hổ và tình huống khó xử",
          href: "/b1niveau/vokabular/3-das-ist-mir-aber-peinlich",
          items: [
            {
              title: "Das tut mir leid",
              description: "Tôi xin lỗi",
              href: "/b1niveau/vokabular/3-das-ist-mir-aber-peinlich/01-das-tut-mir-leid",
            },
            {
              title: "Entschuldigung! Es tut mir leid!",
              description: "Xin lỗi! Tôi xin lỗi!",
              href: "/b1niveau/vokabular/3-das-ist-mir-aber-peinlich/02-entschuldigung-es-tut-mir-leid",
            },
            {
              title: "Das ist mir aber peinlich!",
              description: "Tôi thật xấu hổ!",
              href: "/b1niveau/vokabular/3-das-ist-mir-aber-peinlich/03-das-ist-mir-aber-peinlich",
            },
            {
              title: "Bitte um Hilfe",
              description: "Xin giúp đỡ",
              href: "/b1niveau/vokabular/3-das-ist-mir-aber-peinlich/04-bitte-um-hilfe",
            },
            {
              title: "Übung (Das ist mir aber peinlich!)",
              description: "Bài tập về chủ đề xấu hổ",
              href: "/b1niveau/vokabular/3-das-ist-mir-aber-peinlich/05-uebung-das-ist-mir-aber-peinlich",
            },
          ],
        },
        {
          title: "4. Priorität 1",
          description: "Từ vựng ưu tiên cấp độ 1",
          href: "/b1niveau/vokabular/4-prioritaet-1",
          items: [
            {
              title: "Training Beruf 1",
              description: "Huấn luyện nghề nghiệp 1",
              href: "/b1niveau/vokabular/4-prioritaet-1/01-training-beruf-1",
            },
            {
              title: "Wörter - Spiele - Training",
              description: "Từ vựng - Trò chơi - Luyện tập",
              href: "/b1niveau/vokabular/4-prioritaet-1/02-woerter-spiele-training",
            },
            {
              title: "Grammatik und Evaluation",
              description: "Ngữ pháp và đánh giá",
              href: "/b1niveau/vokabular/4-prioritaet-1/03-grammatik-und-evaluation",
            },
            {
              title: "Filmstation",
              description: "Trạm phim",
              href: "/b1niveau/vokabular/4-prioritaet-1/04-filmstation",
            },
            {
              title: "Magazin",
              description: "Tạp chí",
              href: "/b1niveau/vokabular/4-prioritaet-1/05-magazin",
            },
          ],
        },
        {
          title: "5. Migration",
          description: "Từ vựng về di cư và hội nhập",
          href: "/b1niveau/vokabular/5-migration",
          items: [
            {
              title: "Migration geht uns alle an",
              description: "Di cư liên quan đến tất cả chúng ta",
              href: "/b1niveau/vokabular/5-migration/01-migration-geht-uns-alle-an",
            },
            {
              title: "Eine Migrationsgeschichte",
              description: "Một câu chuyện di cư",
              href: "/b1niveau/vokabular/5-migration/02-eine-migrationsgeschichte",
            },
            {
              title: "Random Wort",
              description: "Từ ngẫu nhiên",
              href: "/b1niveau/vokabular/5-migration/04-random-wort",
            },
            {
              title: "Tổng hợp động từ và tính từ bài 5",
              description: "Tổng hợp từ vựng bài 5",
              href: "/b1niveau/vokabular/5-migration/tong-hop-dong-tu-va-tinh-tu-bai-5",
            },
          ],
        },
        {
          title: "6. Alltag",
          description: "Từ vựng về cuộc sống hàng ngày",
          href: "/b1niveau/vokabular/6-alltag",
          items: [
            {
              title: "Alltagsprobleme",
              description: "Vấn đề hàng ngày",
              href: "/b1niveau/vokabular/6-alltag/01-alltagprobleme",
            },
            {
              title: "Notfälle",
              description: "Tình huống khẩn cấp",
              href: "/b1niveau/vokabular/6-alltag/02-notfaelle",
            },
            {
              title: "Stress im Beruf",
              description: "Căng thẳng trong công việc",
              href: "/b1niveau/vokabular/6-alltag/03-stress-im-beruf",
            },
            {
              title: "Gute Ratschläge & Lachen ist gesund",
              description: "Lời khuyên tốt & Cười có lợi cho sức khỏe",
              href: "/b1niveau/vokabular/6-alltag/04-gute-ratschlaege-und-lachen-ist-gesund",
            },
            {
              title: "Übungen (Alltag)",
              description: "Bài tập về cuộc sống hàng ngày",
              href: "/b1niveau/vokabular/6-alltag/05-uebungen-alltag",
            },
            {
              title: "Tổng hợp động từ và tính từ bài 6",
              description: "Tổng hợp từ vựng bài 6",
              href: "/b1niveau/vokabular/6-alltag/tong-hop-dong-tu-va-tinh-tu-bai-6",
            },
          ],
        },
        {
          title: "7. Europa",
          description: "Từ vựng về châu Âu và văn hóa",
          href: "/b1niveau/vokabular/7-europa",
          items: [
            {
              title: "Wir sind Europa",
              description: "Chúng ta là châu Âu",
              href: "/b1niveau/vokabular/7-europa/01-wir-sind-europa",
            },
            {
              title: "Das politische Europa",
              description: "Châu Âu chính trị",
              href: "/b1niveau/vokabular/7-europa/02-das-politische-europa",
            },
            {
              title: "Meinungen zu Europa",
              description: "Ý kiến về châu Âu",
              href: "/b1niveau/vokabular/7-europa/03-meinungen-zu-europa",
            },
            {
              title: "Europa entdecken",
              description: "Khám phá châu Âu",
              href: "/b1niveau/vokabular/7-europa/04-europa-entdecken",
            },
            {
              title: "Tổng hợp động từ và tính từ bài 7",
              description: "Tổng hợp từ vựng bài 7",
              href: "/b1niveau/vokabular/7-europa/tong-hop-dong-tu-va-tinh-tu-bai-7",
            },
          ],
        },
        {
          title: "8. Frauen & Männer",
          description: "Từ vựng về giới tính và vai trò xã hội",
          href: "/b1niveau/vokabular/8-frauen-maenner",
          items: [
            {
              title: "Frauen und Männerberufe",
              description: "Nghề của phụ nữ và nam giới",
              href: "/b1niveau/vokabular/8-frauen-maenner/01-frauen-und-maennerberufe",
            },
            {
              title: "Über Paare sprechen",
              description: "Nói về các cặp đôi",
              href: "/b1niveau/vokabular/8-frauen-maenner/02-ueber-paare-sprechen",
            },
            {
              title: "Paare lieben",
              description: "Các cặp đôi yêu nhau",
              href: "/b1niveau/vokabular/8-frauen-maenner/03-paare-lieben",
            },
            {
              title: "Tổng hợp động từ và tính từ bài 8",
              description: "Tổng hợp từ vựng bài 8",
              href: "/b1niveau/vokabular/8-frauen-maenner/tong-hop-dong-tu-va-tinh-tu-bai-8",
            },
          ],
        },
        {
          title: "9. Priorität 2",
          description: "Từ vựng ưu tiên cấp độ 2",
          href: "/b1niveau/vokabular/9-prioritaet-2",
          items: [
            {
              title: "Training für den Beruf",
              description: "Huấn luyện cho nghề nghiệp",
              href: "/b1niveau/vokabular/9-prioritaet-2/01-training-fuer-den-beruf",
            },
            {
              title: "Wörter - Spiele - Training",
              description: "Từ vựng - Trò chơi - Luyện tập",
              href: "/b1niveau/vokabular/9-prioritaet-2/02-woerter-spiele-training",
            },
            {
              title: "Grammatik und Evaluation",
              description: "Ngữ pháp và đánh giá",
              href: "/b1niveau/vokabular/9-prioritaet-2/03-grammatik-und-evaluation",
            },
            {
              title: "Filmstation",
              description: "Trạm phim",
              href: "/b1niveau/vokabular/9-prioritaet-2/04-filmstation",
            },
            {
              title: "Magazin - Ankunft",
              description: "Tạp chí - Sự đến",
              href: "/b1niveau/vokabular/9-prioritaet-2/05-magazin-ankunft",
            },
          ],
        },
        {
          title: "10. Arbeit im Wandel",
          description: "Từ vựng về sự thay đổi trong công việc",
          href: "/b1niveau/vokabular/10-arbeit-im-wandel",
          items: [
            {
              title: "Die größte Stadt Deutschlands",
              description: "Thành phố lớn nhất Đức",
              href: "/b1niveau/vokabular/10-arbeit-im-wandel/01-die-groesste-stadt-deutschlands",
            },
            {
              title: "Arbeitsunfälle",
              description: "Tai nạn lao động",
              href: "/b1niveau/vokabular/10-arbeit-im-wandel/02-arbeitsunfaelle",
            },
            {
              title: "Übungen (Arbeit im Wandel)",
              description: "Bài tập về sự thay đổi trong công việc",
              href: "/b1niveau/vokabular/10-arbeit-im-wandel/03-uebungen-arbeit-im-wandel",
            },
            {
              title: "Tổng hợp động từ và tính từ bài 10",
              description: "Tổng hợp từ vựng bài 10",
              href: "/b1niveau/vokabular/10-arbeit-im-wandel/tong-hop-dong-tu-va-tinh-tu-bai-10",
            },
          ],
        },
        {
          title: "11. Klima und Umwelt",
          description: "Từ vựng về khí hậu và môi trường",
          href: "/b1niveau/vokabular/11-klima-und-unwelt",
          items: [
            {
              title: "Wetter",
              description: "Thời tiết",
              href: "/b1niveau/vokabular/11-klima-und-unwelt/01-wetter",
            },
            {
              title: "Der UN-Klimareport",
              description: "Báo cáo khí hậu LHQ",
              href: "/b1niveau/vokabular/11-klima-und-unwelt/02-der-un-klimareport",
            },
            {
              title: "Umweltprobleme",
              description: "Các vấn đề môi trường",
              href: "/b1niveau/vokabular/11-klima-und-unwelt/03-umweltprobleme",
            },
            {
              title: "Übungen (Klima und Umwelt)",
              description: "Bài tập về khí hậu và môi trường",
              href: "/b1niveau/vokabular/11-klima-und-unwelt/04-uebungen-klima-und-unwelt",
            },
            {
              title: "Tổng hợp động từ và tính từ bài 11",
              description: "Tổng hợp từ vựng bài 11",
              href: "/b1niveau/vokabular/11-klima-und-unwelt/tong-hop-dong-tu-va-tinh-tu-bai-11",
            },
          ],
        },
        {
          title: "12. Schule und Lernen",
          description: "Từ vựng về trường học và việc học",
          href: "/b1niveau/vokabular/12-schule-und-lernen",
          items: [
            {
              title: "Schulalltag",
              description: "Cuộc sống học đường hàng ngày",
              href: "/b1niveau/vokabular/12-schule-und-lernen/01-schulalltag",
            },
            {
              title: "Das deutsche Schulsystem",
              description: "Hệ thống giáo dục Đức",
              href: "/b1niveau/vokabular/12-schule-und-lernen/02-das-deutsche-schulsystem",
            },
            {
              title: "Meine Schulzeit",
              description: "Thời học sinh của tôi",
              href: "/b1niveau/vokabular/12-schule-und-lernen/03-meine-schulzeit",
            },
            {
              title: "Übungen (Schule und Lernen)",
              description: "Bài tập về trường học và việc học",
              href: "/b1niveau/vokabular/12-schule-und-lernen/04-uebungen-schule-und-lernen",
            },
            {
              title: "Tổng hợp động từ và tính từ bài 12",
              description: "Tổng hợp từ vựng bài 12",
              href: "/b1niveau/vokabular/12-schule-und-lernen/tong-hop-dong-tu-va-tinh-tu-bai-12",
            },
          ],
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

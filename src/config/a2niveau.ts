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
      title: "Vokabular",
      href: "/a2niveau/vokabular",
      items: [
        {
          title: "1. Willkommen A2",
          description: "Chào mừng đến với khóa học tiếng Đức A2 - Bài học đầu tiên",
          href: "/a2niveau/vokabular/1-willkommen-a2",
          items: [
            {
              title: "Uhrzeiten",
              description: "Học về thời gian trong tiếng Đức",
              href: "/a2niveau/vokabular/1-willkommen-a2/01-grundwortschatz",
            },
            {
              title: "Die Brücke von A1 zu A2",
              description: "Cầu nối từ A1 đến A2",
              href: "/a2niveau/vokabular/1-willkommen-a2/02-begrussung",
            },
            {
              title: "Fit für A2",
              description: "Chuẩn bị sẵn sàng cho A2",
              href: "/a2niveau/vokabular/1-willkommen-a2/03-fit-a2",
            },
            {
              title: "Verb-Adj-Adv 1-A2",
              description: "Động từ, tính từ, trạng từ cơ bản A2",
              href: "/a2niveau/vokabular/1-willkommen-a2/verb-adj-adv",
            },
          ],
        },
        {
          title: "2. Leben und Lernen",
          description: "Từ vựng về cuộc sống và học tập trong tiếng Đức A2",
          href: "/a2niveau/vokabular/2-leben-und-lernen",
          items: [
            {
              title: "Cuộc sống hàng ngày",
              description: "Từ vựng về cuộc sống hàng ngày",
              href: "/a2niveau/vokabular/2-leben-und-lernen/01-alltag",
            },
            {
              title: "Học tập",
              description: "Từ vựng về học tập và giáo dục",
              href: "/a2niveau/vokabular/2-leben-und-lernen/02-lernen",
            },
          ],
        },
        {
          title: "3. Familiengeschichten",
          description: "Từ vựng về gia đình và những câu chuyện gia đình",
          href: "/a2niveau/vokabular/3-familiengeschichten",
          items: [
            {
              title: "Thành viên gia đình",
              description: "Từ vựng về các thành viên trong gia đình",
              href: "/a2niveau/vokabular/3-familiengeschichten/01-familienmitglieder",
            },
            {
              title: "Mối quan hệ",
              description: "Từ vựng về các mối quan hệ trong gia đình",
              href: "/a2niveau/vokabular/3-familiengeschichten/02-beziehungen",
            },
          ],
        },
        {
          title: "4. Unterwegs",
          description: "Từ vựng về phương tiện giao thông và đi lại",
          href: "/a2niveau/vokabular/4-unterwegs",
          items: [
            {
              title: "Phương tiện giao thông",
              description: "Từ vựng về các loại phương tiện giao thông",
              href: "/a2niveau/vokabular/4-unterwegs/01-verkehrsmittel",
            },
          ],
        },
        {
          title: "5. Station 1-A2",
          description: "Trạm dừng đầu tiên - Ôn tập và củng cố kiến thức",
          href: "/a2niveau/vokabular/5-station-1-a2",
          items: [
            {
              title: "Ôn tập từ vựng",
              description: "Ôn tập lại từ vựng đã học",
              href: "/a2niveau/vokabular/5-station-1-a2/01-review",
            },
          ],
        },
        {
          title: "6. Freizeit und Hobby",
          description: "Từ vựng về thời gian rảnh và sở thích",
          href: "/a2niveau/vokabular/6-freizeit-und-hobby",
          items: [
            {
              title: "Hoạt động giải trí",
              description: "Từ vựng về các hoạt động trong thời gian rảnh",
              href: "/a2niveau/vokabular/6-freizeit-und-hobby/01-activities",
            },
          ],
        },
        {
          title: "7. Medien im Alltag",
          description: "Từ vựng về phương tiện truyền thông hàng ngày",
          href: "/a2niveau/vokabular/7-medien-im-alltag",
          items: [
            {
              title: "Phương tiện truyền thông",
              description: "Từ vựng về các loại phương tiện truyền thông",
              href: "/a2niveau/vokabular/7-medien-im-alltag/01-medien",
            },
          ],
        },
        {
          title: "8. Ausgehen Leute treffen",
          description: "Từ vựng về đi chơi và gặp gỡ mọi người",
          href: "/a2niveau/vokabular/8-ausgehen-leute-treffen",
          items: [
            {
              title: "Đi chơi",
              description: "Từ vựng về các hoạt động đi chơi",
              href: "/a2niveau/vokabular/8-ausgehen-leute-treffen/01-ausgehen",
            },
          ],
        },
        {
          title: "9. Station 2-A2",
          description: "Trạm dừng thứ hai - Ôn tập và củng cố",
          href: "/a2niveau/vokabular/9-station-2-a2",
          items: [
            {
              title: "Ôn tập nâng cao",
              description: "Ôn tập và củng cố kiến thức nâng cao",
              href: "/a2niveau/vokabular/9-station-2-a2/01-review-advanced",
            },
          ],
        },
        {
          title: "10. Vom Land in die Stadt",
          description: "Từ vựng về sự thay đổi từ nông thôn đến thành phố",
          href: "/a2niveau/vokabular/10-vom-land-in-die-stadt",
          items: [
            {
              title: "Nông thôn và thành phố",
              description: "Từ vựng về đời sống nông thôn và thành thị",
              href: "/a2niveau/vokabular/10-vom-land-in-die-stadt/01-stadt-land",
            },
          ],
        },
        {
          title: "11. Kultur erleben",
          description: "Từ vựng về trải nghiệm văn hóa và nghệ thuật",
          href: "/a2niveau/vokabular/11-kultur-erleben",
          items: [
            {
              title: "Văn hóa và nghệ thuật",
              description: "Từ vựng về văn hóa và nghệ thuật",
              href: "/a2niveau/vokabular/11-kultur-erleben/01-kultur",
            },
          ],
        },
      ],
    },
    {
      title: "Vokabular Thema",
      href: "/a2niveau/vokabular-thema",
      items: [
        {
          title: "100 adj pho bien A2",
          description: "100 tính từ phổ biến và quan trọng nhất trong tiếng Đức A2",
          href: "/a2niveau/vokabular-thema/100-adj-pho-bien-a2",
        },
        {
          title: "100 adv pho bien A2",
          description: "100 trạng từ phổ biến và quan trọng nhất trong tiếng Đức A2",
          href: "/a2niveau/vokabular-thema/100-adv-pho-bien-a2",
        },
        {
          title: "100 verb pho bien A2",
          description: "100 động từ phổ biến và quan trọng nhất trong tiếng Đức A2",
          href: "/a2niveau/vokabular-thema/100-verb-pho-bien-a2",
        },
        {
          title: "Monate und Jahreszeiten",
          description: "Tháng và mùa trong năm - Kiến thức cơ bản về thời gian",
          href: "/a2niveau/vokabular-thema/1-monaten",
        },
      ],
    },
    {
      title: "Übungen",
      href: "/a2niveau/Übungen",
      items: [
        {
          title: "Adjektivendungen",
          description: "Bài tập về đuôi tính từ sau các mạo từ khác nhau",
          href: "/a2niveau/Übungen/adjektivendungen",
          items: [
            {
              title: "Teil 1: Nach bestimmtem Artikel",
              href: "/a2niveau/Übungen/adjektivendungen/teil1",
            },
            {
              title: "Teil 2: Nach unbestimmtem Artikel",
              href: "/a2niveau/Übungen/adjektivendungen/teil2",
            },
            {
              title: "Teil 3: Nach Nullartikel",
              href: "/a2niveau/Übungen/adjektivendungen/teil3",
            },
            {
              title: "Teil 4: Gemischte Übungen",
              href: "/a2niveau/Übungen/adjektivendungen/teil4",
            },
          ],
        },
        {
          title: "Steigerung",
          description: "Bài tập về so sánh (Komparativ và Superlativ)",
          href: "/a2niveau/Übungen/steigerung",
          items: [
            {
              title: "Teil 1: So sánh bằng",
              href: "/a2niveau/Übungen/steigerung/teil1",
            },
            {
              title: "Teil 2: So sánh hơn (Komparativ)",
              href: "/a2niveau/Übungen/steigerung/teil2",
            },
            {
              title: "Teil 3: So sánh nhất (Superlativ)",
              href: "/a2niveau/Übungen/steigerung/teil3",
            },
          ],
        },
        {
          title: "Perfekt Präteritum",
          description: "Bài tập về thì quá khứ Perfekt và Präteritum",
          href: "/a2niveau/Übungen/perfekt-prateritum",
          items: [
            {
              title: "Teil 1: Perfekt Grundlagen",
              href: "/a2niveau/Übungen/perfekt-prateritum/teil1",
            },
            {
              title: "Teil 2: Präteritum Formen",
              href: "/a2niveau/Übungen/perfekt-prateritum/teil2",
            },
            {
              title: "Teil 3: Perfekt vs Präteritum",
              href: "/a2niveau/Übungen/perfekt-prateritum/teil3",
            },
            {
              title: "Teil 4: Irregular Verbs",
              href: "/a2niveau/Übungen/perfekt-prateritum/teil4",
            },
            {
              title: "Teil 5: Advanced Exercises",
              href: "/a2niveau/Übungen/perfekt-prateritum/teil5",
            },
          ],
        },
        {
          title: "Plusquamperfekt",
          description: "Bài tập về thì quá khứ hoàn thành Plusquamperfekt",
          href: "/a2niveau/Übungen/plusquamperfekt",
          items: [
            {
              title: "Teil 1: Grundlagen",
              href: "/a2niveau/Übungen/plusquamperfekt/teil1",
            },
            {
              title: "Teil 2: Mit haben und sein",
              href: "/a2niveau/Übungen/plusquamperfekt/teil2",
            },
            {
              title: "Teil 3: Erweiterte Übungen",
              href: "/a2niveau/Übungen/plusquamperfekt/teil3",
            },
          ],
        },
        {
          title: "Nebensätze",
          description: "Bài tập về mệnh đề phụ và liên từ",
          href: "/a2niveau/Übungen/nebensatze",
          items: [
            {
              title: "Teil 1: Temporalsätze",
              href: "/a2niveau/Übungen/nebensatze/teil1",
            },
            {
              title: "Teil 2: Kausalsätze",
              href: "/a2niveau/Übungen/nebensatze/teil2",
            },
            {
              title: "Teil 3: Konditionalsätze",
              href: "/a2niveau/Übungen/nebensatze/teil3",
            },
            {
              title: "Teil 4: Relativsätze",
              href: "/a2niveau/Übungen/nebensatze/teil4",
            },
            {
              title: "Teil 5: Finalsätze",
              href: "/a2niveau/Übungen/nebensatze/teil5",
            },
            {
              title: "Teil 6: Modalsätze",
              href: "/a2niveau/Übungen/nebensatze/teil6",
            },
            {
              title: "Teil 7: Gemischte Übungen",
              href: "/a2niveau/Übungen/nebensatze/teil7",
            },
          ],
        },
        {
          title: "Passiv",
          description: "Bài tập về thể bị động (Passiv)",
          href: "/a2niveau/Übungen/passiv",
          items: [
            {
              title: "Teil 1: Präsens Passiv",
              href: "/a2niveau/Übungen/passiv/teil1",
            },
            {
              title: "Teil 2: Präteritum Passiv",
              href: "/a2niveau/Übungen/passiv/teil2",
            },
            {
              title: "Teil 3: Perfekt Passiv",
              href: "/a2niveau/Übungen/passiv/teil3",
            },
            {
              title: "Teil 4: Modalverben im Passiv",
              href: "/a2niveau/Übungen/passiv/teil4",
            },
          ],
        },
        {
          title: "Futur I & II",
          description: "Bài tập về thì tương lai Futur I và Futur II",
          href: "/a2niveau/Übungen/futur",
          items: [
            {
              title: "Teil 1: Futur I",
              href: "/a2niveau/Übungen/futur/teil1",
            },
            {
              title: "Teil 2: Futur II",
              href: "/a2niveau/Übungen/futur/teil2",
            },
          ],
        },
        {
          title: "Possessivpronomen",
          description: "Bài tập về đại từ sở hữu",
          href: "/a2niveau/Übungen/possessivpronomen",
          items: [
            {
              title: "Teil 1: Grundformen",
              href: "/a2niveau/Übungen/possessivpronomen/teil1",
            },
            {
              title: "Teil 2: Deklination",
              href: "/a2niveau/Übungen/possessivpronomen/teil2",
            },
          ],
        },
        {
          title: "Reflexivpronomen",
          description: "Bài tập về đại từ phản thân",
          href: "/a2niveau/Übungen/reflexivpronomen",
          items: [
            {
              title: "Teil 1: Reflexive Verben",
              href: "/a2niveau/Übungen/reflexivpronomen/teil1",
            },
            {
              title: "Teil 2: Akkusativ vs Dativ",
              href: "/a2niveau/Übungen/reflexivpronomen/teil2",
            },
            {
              title: "Teil 3: Reziproke Verben",
              href: "/a2niveau/Übungen/reflexivpronomen/teil3",
            },
            {
              title: "Teil 4: Gemischte Übungen",
              href: "/a2niveau/Übungen/reflexivpronomen/teil4",
            },
            {
              title: "Teil 5: Advanced Reflexive",
              href: "/a2niveau/Übungen/reflexivpronomen/teil5",
            },
          ],
        },
        {
          title: "Genitiv",
          description: "Bài tập về cách Genitiv (sở hữu cách)",
          href: "/a2niveau/Übungen/genitiv",
          items: [
            {
              title: "Teil 1: Genitiv Grundlagen",
              href: "/a2niveau/Übungen/genitiv/teil1",
            },
            {
              title: "Teil 2: Präpositionen mit Genitiv",
              href: "/a2niveau/Übungen/genitiv/teil2",
            },
            {
              title: "Teil 3: Genitiv Attribute",
              href: "/a2niveau/Übungen/genitiv/teil3",
            },
          ],
        },
      ],
    },
  ],
};

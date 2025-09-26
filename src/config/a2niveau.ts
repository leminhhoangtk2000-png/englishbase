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
          description: "Chào mừng đến với khóa học tiếng Đức A2 - Bài học đầu tiên • Đang cập nhật",
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
              title: "Leben und Lernen in Europa",
              description: "Cuộc sống và học tập ở châu Âu",
              href: "/a2niveau/vokabular/2-leben-und-lernen/1.-leben-und-lernen-in-europa",
            },
            {
              title: "Die neue Arbeitsmigration",
              description: "Di cư lao động mới",
              href: "/a2niveau/vokabular/2-leben-und-lernen/2.-die-neue-arbeismigration",
            },
            {
              title: "Mehrsprachigkeit oder Englisch für alle",
              description: "Đa ngôn ngữ hay tiếng Anh cho tất cả",
              href: "/a2niveau/vokabular/2-leben-und-lernen/3.-mehrsprachigkeit-oder-englisch-fur-alle",
            },
            {
              title: "Übung 1-A2",
              description: "Bài tập 1 cấp độ A2",
              href: "/a2niveau/vokabular/2-leben-und-lernen/4.-ubung-1-a2",
            },
            {
              title: "Verb-Adj-Adv 2-A2",
              description: "Động từ, tính từ, trạng từ bài 2 A2",
              href: "/a2niveau/vokabular/2-leben-und-lernen/verb-adj-adv-2-a2",
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
              title: "Familie Saalfeld",
              description: "Gia đình Saalfeld",
              href: "/a2niveau/vokabular/3-familiengeschichten/1.-familie-saalfeld",
            },
            {
              title: "Meine Verwandten",
              description: "Người thân của tôi",
              href: "/a2niveau/vokabular/3-familiengeschichten/2.-meine-verwandten",
            },
            {
              title: "Au-pair - Arbeiten und Fremdsprachen",
              description: "Au-pair - Làm việc và ngoại ngữ",
              href: "/a2niveau/vokabular/3-familiengeschichten/3.-au-pair--arbeiten-und-fremdsprachen",
            },
            {
              title: "Ein mysteriöser Fall",
              description: "Một vụ án bí ẩn",
              href: "/a2niveau/vokabular/3-familiengeschichten/4.-ein-mysteriöser-fall",
            },
            {
              title: "Übung 2-A2",
              description: "Bài tập 2 cấp độ A2",
              href: "/a2niveau/vokabular/3-familiengeschichten/5.-ubung-2-a2",
            },
            {
              title: "Verb-Adj-Adv 3-A2",
              description: "Động từ, tính từ, trạng từ bài 3 A2",
              href: "/a2niveau/vokabular/3-familiengeschichten/verb-adj-adv-3-a2",
            },
          ],
        },
        {
          title: "4. Unterwegs",
          description: "Từ vựng về phương tiện giao thông và đi lại",
          href: "/a2niveau/vokabular/4-unterwegs",
          items: [
            {
              title: "Unterwegs",
              description: "Trên đường đi",
              href: "/a2niveau/vokabular/4-unterwegs/1.-unterwegs",
            },
            {
              title: "Eine Reise machen",
              description: "Thực hiện một chuyến đi",
              href: "/a2niveau/vokabular/4-unterwegs/2.-eine-reise-machen",
            },
            {
              title: "Eine Reise planen und buchen",
              description: "Lên kế hoạch và đặt chuyến đi",
              href: "/a2niveau/vokabular/4-unterwegs/3.-eine-reise-plannen-und-buchen",
            },
            {
              title: "Unterwegs mit dem Zug",
              description: "Đi lại bằng tàu hỏa",
              href: "/a2niveau/vokabular/4-unterwegs/4.-unterwegs-mit-dem-zug",
            },
            {
              title: "Gute Fahrt",
              description: "Chuyến đi tốt lành",
              href: "/a2niveau/vokabular/4-unterwegs/5.-gute-fahrt",
            },
            {
              title: "Verb-Adj-Adv 4-A2",
              description: "Động từ, tính từ, trạng từ bài 4 A2",
              href: "/a2niveau/vokabular/4-unterwegs/verb-adj-adv-4-a2",
            },
          ],
        },
        {
          title: "5. Erste Station",
          description: "Trạm dừng đầu tiên - Ôn tập và củng cố kiến thức",
          href: "/a2niveau/vokabular/5-erste-station",
          items: [
            {
              title: "Berufsbilder 1-A2",
              description: "Hình ảnh nghề nghiệp 1-A2",
              href: "/a2niveau/vokabular/5-station-1-a2/1.-berufsbilder-1-a2",
            },
            {
              title: "Wörter Spiele Training 1-A2",
              description: "Luyện tập trò chơi từ vựng 1-A2",
              href: "/a2niveau/vokabular/5-station-1-a2/2.-worter-spiele-trainning-1-a2",
            },
            {
              title: "Filmstation 1-A2",
              description: "Trạm phim 1-A2",
              href: "/a2niveau/vokabular/5-station-1-a2/3.-filmstation-1-a2",
            },
            {
              title: "Magazin 1-A2",
              description: "Tạp chí 1-A2",
              href: "/a2niveau/vokabular/5-station-1-a2/4.-magazin-1-a2",
            },
            {
              title: "Verb-Adj-Adv 5-A2",
              description: "Động từ, tính từ, trạng từ bài 5 A2",
              href: "/a2niveau/vokabular/5-station-1-a2/verb-adj-adv-5-a2",
            },
          ],
        },
        {
          title: "6. Zeit mit Freunden",
          description: "Từ vựng về thời gian rảnh và sở thích",
          href: "/a2niveau/vokabular/6-zeit-mit-freunden",
          items: [
            {
              title: "Hobbys",
              description: "Sở thích cá nhân",
              href: "/a2niveau/vokabular/6-freizeit-und-hobby/1.-hobbys",
            },
            {
              title: "Freizeit und Forschung",
              description: "Thời gian rảnh và nghiên cứu",
              href: "/a2niveau/vokabular/6-freizeit-und-hobby/2.-freizeit-und-forschung",
            },
            {
              title: "Leute kennenlernen",
              description: "Làm quen với mọi người",
              href: "/a2niveau/vokabular/6-freizeit-und-hobby/3.-leute-kennenlernen",
            },
            {
              title: "Das perfekte Wochenende",
              description: "Cuối tuần hoàn hảo",
              href: "/a2niveau/vokabular/6-freizeit-und-hobby/4.-das-perfekte-wochenende",
            },
            {
              title: "Übung 4-A2",
              description: "Bài tập 4 cấp độ A2",
              href: "/a2niveau/vokabular/6-freizeit-und-hobby/5.-ubung-4-a2",
            },
            {
              title: "Verb-Adj-Adv 6-A2",
              description: "Động từ, tính từ, trạng từ bài 6 A2",
              href: "/a2niveau/vokabular/6-freizeit-und-hobby/verb-adj-adv-6-a2",
            },
          ],
        },
        {
          title: "7. Medien im Alltag",
          description: "Từ vựng về phương tiện truyền thông hàng ngày",
          href: "/a2niveau/vokabular/7-medien-im-alltag",
          items: [
            {
              title: "Medien im Alltag",
              description: "Phương tiện truyền thông trong cuộc sống hàng ngày",
              href: "/a2niveau/vokabular/7-medien-im-alltag/1.-medien-im-alltag",
            },
            {
              title: "Medien im Tag",
              description: "Phương tiện truyền thông trong ngày",
              href: "/a2niveau/vokabular/7-medien-im-alltag/2.-medien-im-tag",
            },
            {
              title: "Unterwegs im Internet",
              description: "Lướt Internet khi di chuyển",
              href: "/a2niveau/vokabular/7-medien-im-alltag/3.-unterwegs-im-internet",
            },
            {
              title: "Wie bitte? - Was hast du gesagt?",
              description: "Xin lỗi? - Bạn đã nói gì?",
              href: "/a2niveau/vokabular/7-medien-im-alltag/4.-wie-bitte---was-hast-du-gesagt",
            },
            {
              title: "Schnäppchenjagd",
              description: "Săn hàng giảm giá",
              href: "/a2niveau/vokabular/7-medien-im-alltag/5.-schnappchenjagd",
            },
            {
              title: "Übung 5-A2",
              description: "Bài tập 5 cấp độ A2",
              href: "/a2niveau/vokabular/7-medien-im-alltag/6.-ubung-5-a2",
            },
            {
              title: "Verb-Adj-Adv 7-A2",
              description: "Động từ, tính từ, trạng từ bài 7 A2",
              href: "/a2niveau/vokabular/7-medien-im-alltag/verb-adj-adv-7-a2",
            },
          ],
        },
        {
          title: "8. Ausgehen Leute treffen",
          description: "Từ vựng về đi chơi và gặp gỡ mọi người",
          href: "/a2niveau/vokabular/8-ausgehen-leute-treffen",
          items: [
            {
              title: "Ausgehen - nicht nur am Wochenende",
              description: "Đi chơi - không chỉ vào cuối tuần",
              href: "/a2niveau/vokabular/8-ausgehen-leute-treffen/1.-ausgehen---nicht-nur-am-wochenende",
            },
            {
              title: "Im Restaurant",
              description: "Trong nhà hàng",
              href: "/a2niveau/vokabular/8-ausgehen-leute-treffen/2.-im-restaurant",
            },
            {
              title: "Rund ums Essen",
              description: "Xoay quanh việc ăn uống",
              href: "/a2niveau/vokabular/8-ausgehen-leute-treffen/3.-rund-ums-essen",
            },
            {
              title: "Leute kennen lernen",
              description: "Làm quen với mọi người",
              href: "/a2niveau/vokabular/8-ausgehen-leute-treffen/4.-leute-kennen-lernen",
            },
            {
              title: "Übung 6-A2",
              description: "Bài tập 6 cấp độ A2",
              href: "/a2niveau/vokabular/8-ausgehen-leute-treffen/5.-ubung-6-a2",
            },
            {
              title: "Verb-Adj-Adv 8-A2",
              description: "Động từ, tính từ, trạng từ bài 8 A2",
              href: "/a2niveau/vokabular/8-ausgehen-leute-treffen/verb-adj-adv-8-a2",
            },
          ],
        },
        {
          title: "9. Station 2-A2",
          description: "Trạm dừng thứ hai - Ôn tập và củng cố",
          href: "/a2niveau/vokabular/9-station-2-a2",
          items: [
            {
              title: "Berufsbilder 2-A2",
              description: "Hình ảnh nghề nghiệp 2-A2",
              href: "/a2niveau/vokabular/9-station-2-a2/1.-berufbilder-2-a2",
            },
            {
              title: "Wörter - Spiele - Training 2-A2",
              description: "Từ vựng - Trò chơi - Luyện tập 2-A2",
              href: "/a2niveau/vokabular/9-station-2-a2/2.-worter---spiele----training-2-a2",
            },
            {
              title: "Filmstation 2-A2",
              description: "Trạm phim 2-A2",
              href: "/a2niveau/vokabular/9-station-2-a2/3.-filmstation-2-a2",
            },
            {
              title: "Magazine 2-A2",
              description: "Tạp chí 2-A2",
              href: "/a2niveau/vokabular/9-station-2-a2/4.-magazine-2-a2",
            },
            {
              title: "Verb-Adj-Adv 9-A2",
              description: "Động từ, tính từ, trạng từ bài 9 A2",
              href: "/a2niveau/vokabular/9-station-2-a2/verb-adj-adv-9-a2",
            },
          ],
        },
        {
          title: "10. Vom Land in die Stadt",
          description: "Từ vựng về sự thay đổi từ nông thôn đến thành phố",
          href: "/a2niveau/vokabular/10-vom-land-in-die-stadt",
          items: [
            {
              title: "Stadtleben oder Landluft",
              description: "Cuộc sống thành thị hay không khí nông thôn",
              href: "/a2niveau/vokabular/10-vom-land-in-die-stadt/1.-stadtleben-oder-landluft",
            },
            {
              title: "Vom Land in die Stadt",
              description: "Từ nông thôn đến thành phố",
              href: "/a2niveau/vokabular/10-vom-land-in-die-stadt/2.-vom-land-in-die-stadt",
            },
            {
              title: "Der Umzug",
              description: "Việc chuyển nhà",
              href: "/a2niveau/vokabular/10-vom-land-in-die-stadt/3.-der-umzug",
            },
            {
              title: "Die Dorfrocker",
              description: "Những rocker nông thôn",
              href: "/a2niveau/vokabular/10-vom-land-in-die-stadt/4.-die-dorfrocker",
            },
            {
              title: "Verb-Adj-Adv 10-A2",
              description: "Động từ, tính từ, trạng từ bài 10 A2",
              href: "/a2niveau/vokabular/10-vom-land-in-die-stadt/verb-adj-adv-10-a2",
            },
          ],
        },
        {
          title: "11. Kultur erleben",
          description: "Từ vựng về trải nghiệm văn hóa và nghệ thuật",
          href: "/a2niveau/vokabular/11-kultur-erleben",
          items: [
            {
              title: "Kulturhauptstädte Europas",
              description: "Thủ đô văn hóa châu Âu",
              href: "/a2niveau/vokabular/11-kultur-erleben/1.-kulturhauptstaedte-europas",
            },
            {
              title: "Kulturreise",
              description: "Chuyến du lịch văn hóa",
              href: "/a2niveau/vokabular/11-kultur-erleben/2.-kulturreise",
            },
            {
              title: "Über Vergangenes sprechen",
              description: "Nói về những điều trong quá khứ",
              href: "/a2niveau/vokabular/11-kultur-erleben/3.-uber-vergangenes-sprechen",
            },
            {
              title: "Verb-Adj-Adv 11-A2",
              description: "Động từ, tính từ, trạng từ bài 11 A2",
              href: "/a2niveau/vokabular/11-kultur-erleben/verb-adj-adv-11-a2",
            },
          ],
        },
      ],
    },
    {
      title: "Vokabular Thema",
      description: "Từ vựng theo chủ đề A2 - Tổng hợp từ vựng quan trọng",
      href: "/a2niveau/vokabular-thema",
      items: [
        {
          title: "100 adj pho bien A2",
          description: "100 tính từ phổ biến và quan trọng nhất trong tiếng Đức A2",
          href: "/a2niveau/vokabular-thema/100-adj-pho-bien-a2",
          items: [
            {
              title: "50 adj pho bien 1-A2",
              description: "50 tính từ phổ biến phần 1 A2",
              href: "/a2niveau/vokabular-thema/100-adj-pho-bien-a2/1.-50-adj-pho-bien-1-a2",
            },
            {
              title: "50 adj pho bien 2-A2", 
              description: "50 tính từ phổ biến phần 2 A2",
              href: "/a2niveau/vokabular-thema/100-adj-pho-bien-a2/2.-50-adj-pho-bien-2-a2",
            },
          ],
        },
        {
          title: "100 adv pho bien A2", 
          description: "100 trạng từ phổ biến và quan trọng nhất trong tiếng Đức A2",
          href: "/a2niveau/vokabular-thema/100-adv-pho-bien-a2",
          items: [
            {
              title: "50 adv pho bien 1-A2",
              description: "50 trạng từ phổ biến phần 1 A2",
              href: "/a2niveau/vokabular-thema/100-adv-pho-bien-a2/1.-50-adv-pho-bien-1-a2",
            },
            {
              title: "50 adv pho bien 2-A2",
              description: "50 trạng từ phổ biến phần 2 A2", 
              href: "/a2niveau/vokabular-thema/100-adv-pho-bien-a2/2.-50-adv-pho-bien-2-a2",
            },
          ],
        },
        {
          title: "100 verb pho bien A2",
          description: "100 động từ phổ biến và quan trọng nhất trong tiếng Đức A2",
          href: "/a2niveau/vokabular-thema/100-verb-pho-bien-a2", 
          items: [
            {
              title: "50 verb pho bien 1-A2",
              description: "50 động từ phổ biến phần 1 A2",
              href: "/a2niveau/vokabular-thema/100-verb-pho-bien-a2/1.-50-verb-pho-bien-1-a2",
            },
            {
              title: "50 verb pho bien 2-A2",
              description: "50 động từ phổ biến phần 2 A2",
              href: "/a2niveau/vokabular-thema/100-verb-pho-bien-a2/2.-50-verb-pho-bien-2-a2",
            },
            {
              title: "50 verb pho bien 3-A2", 
              description: "50 động từ phổ biến phần 3 A2",
              href: "/a2niveau/vokabular-thema/100-verb-pho-bien-a2/3.-50-verb-pho-bien-3-a2",
            },
            {
              title: "50 verb pho bien 4-A2",
              description: "50 động từ phổ biến phần 4 A2",
              href: "/a2niveau/vokabular-thema/100-verb-pho-bien-a2/4.-50-verb-pho-bien-4-a2",
            },
          ],
        },
        {
          title: "Monate und Jahreszeiten",
          description: "Tháng và mùa trong năm - Kiến thức cơ bản về thời gian",
          href: "/a2niveau/vokabular-thema/1.-monaten",
        },
      ],
    },
    {
      title: "Übungen",
      href: "/a2niveau/Übungen",
      items: [
        {
          title: "Bài tập ngữ pháp A2",
          description: "Tổng quan về bài tập ngữ pháp A2 và hướng dẫn học tập nâng cao",
          href: "/a2niveau/Übungen/0-bai-tap-ngu-phap-a2",
        },
        {
          title: "Adjektivendungen",
          description: "Bài tập về đuôi tính từ sau các mạo từ khác nhau • 4 bài tập",
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
          description: "Bài tập về so sánh (Komparativ và Superlativ) • 3 bài tập",
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
          description: "Bài tập về thì quá khứ Perfekt và Präteritum • 5 bài tập",
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
          description: "Bài tập về thì quá khứ hoàn thành Plusquamperfekt • 3 bài tập",
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
          description: "Bài tập về mệnh đề phụ và liên từ • 7 bài tập",
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
          description: "Bài tập về thể bị động (Passiv) • 4 bài tập",
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
          description: "Bài tập về thì tương lai Futur I và Futur II • 2 bài tập",
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
          description: "Bài tập về đại từ sở hữu • 2 bài tập",
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
          description: "Bài tập về đại từ phản thân • 5 bài tập",
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
          description: "Bài tập về cách Genitiv (sở hữu cách) • 3 bài tập",
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

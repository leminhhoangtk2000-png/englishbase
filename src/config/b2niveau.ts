import type { DocsConfig } from "@/types";

export const docsConfig: DocsConfig = {
  items: [
    {
      title: "Ngữ pháp - Grammatik",
      items: [
        {
          title: "Der Konjunktiv II",
          description: "Hướng dẫn sử dụng Konjunktiv II ở thì hiện tại và quá khứ",
          href: "/b2niveau/grammatik/01-konjunktiv-ii",
        },
        {
          title: "Doppelkonnektoren",
          description: "Hướng dẫn sử dụng Doppelkonnektoren",
          href: "/b2niveau/grammatik/02-doppelkonnektoren",
        },
        {
          title: "Infinitivkonstruktionen mit zu",
          description: "Cấu trúc động từ nguyên mẫu với zu",
          href: "/b2niveau/grammatik/03-infinitivkonstruktionen",
        },
        {
          title: "Relativsätze mit Präpositionen",
          description: "Mệnh đề quan hệ với giới từ",
          href: "/b2niveau/grammatik/04-relativsaetze",
        },
        {
          title: "Indirekte Rede",
          description: "Câu gián tiếp trong Konjunktiv I & II",
          href: "/b2niveau/grammatik/05-indirekte-rede",
        },
        {
          title: "Passiv",
          description: "Thể bị động cơ bản và nâng cao",
          href: "/b2niveau/grammatik/06-passiv",
        },
        {
          title: "Partizipien als Adjektive",
          description: "Phân từ được sử dụng như tính từ",
          href: "/b2niveau/grammatik/07-partizipien",
        },
        {
          title: "Redemittel für Argumentationen",
          description: "Các mẫu câu cho việc lập luận",
          href: "/b2niveau/grammatik/08-redemittel",
        },
        {
          title: "Wortbildung",
          description: "Tạo từ mới trong tiếng Đức",
          href: "/b2niveau/grammatik/09-wortbildung",
        },
        {
          title: "Nominalisierung",
          description: "Danh từ hóa trong tiếng Đức",
          href: "/b2niveau/grammatik/10-nominalisierung",
        },
        {
          title: "Temporal và Kausal Konnektoren",
          description: "Liên từ chỉ thời gian và nguyên nhân",
          href: "/b2niveau/grammatik/11-konnektoren",
        },
        {
          title: "Passiv erweitert",
          description: "Thể bị động nâng cao với Zustandspassiv",
          href: "/b2niveau/grammatik/12-passiv-erweitert",
        },
        {
          title: "Argumentative Texte",
          description: "Kỹ thuật viết văn bản lập luận",
          href: "/b2niveau/grammatik/13-argumentative-texte",
        },
      ],
    },
    {
      title: "Từ vựng - Wortschatz",
      items: [
        {
          title: "Kinh tế - Wirtschaft",
          description: "Từ vựng về kinh tế và kinh doanh",
          href: "/b2niveau/wortschatz/01-wirtschaft",
        },
        {
          title: "Chính trị - Politik",
          description: "Từ vựng về chính trị và xã hội",
          href: "/b2niveau/wortschatz/02-politik",
        },
        {
          title: "Khoa học - Wissenschaft",
          description: "Từ vựng về khoa học và công nghệ",
          href: "/b2niveau/wortschatz/03-wissenschaft",
        },
        {
          title: "Văn hóa - Kultur",
          description: "Từ vựng về văn hóa và nghệ thuật",
          href: "/b2niveau/wortschatz/04-kultur",
        },
      ],
    },
    {
      title: "Bài tập - Übungen",
      items: [
        {
          title: "Luyện ngữ pháp B2",
          description: "Bài tập thực hành ngữ pháp cấp độ B2",
          href: "/b2niveau/uebungen/01-grammatik-uebungen",
        },
        {
          title: "Luyện từ vựng B2",
          description: "Bài tập thực hành từ vựng cấp độ B2",
          href: "/b2niveau/uebungen/02-wortschatz-uebungen",
        },
        {
          title: "Luyện viết B2",
          description: "Bài tập thực hành viết cấp độ B2",
          href: "/b2niveau/uebungen/03-schreiben-uebungen",
        },
      ],
    },
  ],
};

// Keep backwards compatibility
export const b2niveauConfig = {
  sidebarNav: docsConfig.items,
};

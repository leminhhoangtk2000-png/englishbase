import type { DocsConfig } from "@/types";

export const docsConfig: DocsConfig = {
  items: [
    {
      title: "Grammatik",
      href: "/b2niveau/grammatik",
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
      title: "Vokabular",
      href: "/b2niveau/vokabular",
      items: [
        {
          title: "1. Nomen-Verb-Verbindungen",
          description: "50 kết hợp danh từ-động từ cơ bản và thông dụng nhất (Teil 1-5)",
          href: "/b2niveau/vokabular/nomen-verb-verbindungen",
          items: [
            {
              title: "Teil 1",
              description: "Nomen-Verb-Verbindungen cơ bản phần 1",
              href: "/b2niveau/vokabular/nomen-verb-verbindungen/teil1",
            },
            {
              title: "Teil 2",
              description: "Nomen-Verb-Verbindungen cơ bản phần 2", 
              href: "/b2niveau/vokabular/nomen-verb-verbindungen/teil2",
            },
            {
              title: "Teil 3",
              description: "Nomen-Verb-Verbindungen cơ bản phần 3",
              href: "/b2niveau/vokabular/nomen-verb-verbindungen/teil3",
            },
            {
              title: "Teil 4",
              description: "Nomen-Verb-Verbindungen cơ bản phần 4",
              href: "/b2niveau/vokabular/nomen-verb-verbindungen/teil4",
            },
            {
              title: "Teil 5", 
              description: "Nomen-Verb-Verbindungen cơ bản phần 5",
              href: "/b2niveau/vokabular/nomen-verb-verbindungen/teil5",
            },
          ],
        },
        {
          title: "2. Nomen-Verb-Verbindungen 2", 
          description: "50 kết hợp danh từ-động từ nâng cao và chuyên nghiệp (Teil 6-10)",
          href: "/b2niveau/vokabular/nomen-verb-verbindungen-2",
        },
        {
          title: "3. Nomen-Verb-Verbindungen 3",
          description: "50 kết hợp danh từ-động từ học thuật và hành chính (Teil 11-15)",
          href: "/b2niveau/vokabular/nomen-verb-verbindungen-3",
        },
      ],
    },
    {
      title: "Übungen",
      href: "/b2niveau/Übungen",
      items: [
        {
          title: "Teil 1: Doppelkonnektoren",
          description: "Luyện tập điền đúng các Doppelkonnektoren như sowohl...als auch, nicht nur...sondern auch",
          href: "/b2niveau/Übungen/teil1",
        },
        {
          title: "Teil 2: Doppelkonnektoren Erweitert",
          description: "Bài tập mở rộng về Doppelkonnektoren trong các ngữ cảnh khác nhau",
          href: "/b2niveau/Übungen/teil2",
        },
        {
          title: "Teil 3: Temporal und Kausal",
          description: "Bài tập về cấu trúc thời gian và nguyên nhân với Präpositionen, Konnektoren, Adverbien",
          href: "/b2niveau/Übungen/teil3",
        },
      ],
    },
  ],
};

// Keep backwards compatibility
export const b2niveauConfig = {
  sidebarNav: docsConfig.items,
};

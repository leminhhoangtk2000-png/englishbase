type BlankType = {
  type: 'blank';
  correctAnswer: string;
};

type TextPartType = string | BlankType;

export const teil2ArtikelData = {
  title: "Teil 2: der, die, das in Präsens - Textübungen",
  description: "Luyện tập mạo từ (der, die, das) và chia động từ (Präsens) thông qua bài khóa",
  vocabulary: [
    "backen", "sein", "spielen", "die", "helfen", "nehmen", "lesen", "arbeiten", 
    "stehen", "mischen", "besuchen", "wohnen", "kochen", "schmecken", "laufen", 
    "geben", "machen", "haben", "schlafen", "fahren", "bestellen", "lernen", 
    "trinken", "gehen", "erzählen", "aufstehen", "heißen", "bleiben", "essen", 
    "lieben", "treffen", "sehen"
  ],
  sections: [
    {
      title: "Teil 1: Mein Zimmer",
      description: "Trong phần này, bạn sẽ dùng: die (mạo từ); và các động từ: sein, wohnen, geben, stehen, machen, heißen, haben, spielen, arbeiten, lernen.",
      textParts: [
        "Mein Name ",
        { type: "blank" as const, correctAnswer: "ist" },
        " Lisa. Ich ",
        { type: "blank" as const, correctAnswer: "wohne" },
        " in einem Haus. In meinem Zimmer ",
        { type: "blank" as const, correctAnswer: "gibt" },
        " es das Bett, den Schrank und die Lampe. ",
        { type: "blank" as const, correctAnswer: "Die" },
        " Lampe ",
        { type: "blank" as const, correctAnswer: "steht" },
        " auf dem Tisch. Jeden Morgen ",
        { type: "blank" as const, correctAnswer: "mache" },
        " ich mein Bett. Mein Bruder ",
        { type: "blank" as const, correctAnswer: "heißt" },
        " Tim. Er ",
        { type: "blank" as const, correctAnswer: "hat" },
        " ein großes Zimmer. In seinem Zimmer gibt es einen Computer und einen Stuhl. Tim ",
        { type: "blank" as const, correctAnswer: "spielt" },
        " gern Videospiele. Unsere Eltern ",
        { type: "blank" as const, correctAnswer: "arbeiten" },
        " in einer Firma. Wir ",
        { type: "blank" as const, correctAnswer: "lernen" },
        " Deutsch in der Schule und ",
        { type: "blank" as const, correctAnswer: "machen" },
        " jeden Tag Hausaufgaben."
      ] as TextPartType[]
    },
    {
      title: "Teil 2: In der Küche",
      description: "Trong phần này, bạn sẽ dùng: die, das (mạo từ); và các động từ: kochen, sein, helfen, schmecken, essen, geben, nehmen, machen.",
      textParts: [
        "In der Küche ",
        { type: "blank" as const, correctAnswer: "kocht" },
        " meine Mutter jeden Tag. ",
        { type: "blank" as const, correctAnswer: "Das" },
        " Essen ",
        { type: "blank" as const, correctAnswer: "ist" },
        " immer lecker. Manchmal ",
        { type: "blank" as const, correctAnswer: "helfe" },
        " ich ihr beim Kochen. Die Suppe ",
        { type: "blank" as const, correctAnswer: "schmeckt" },
        " sehr gut. Nach dem ",
        { type: "blank" as const, correctAnswer: "Essen" },
        " ",
        { type: "blank" as const, correctAnswer: "gibt" },
        " es oft Nachtisch. Mein Vater ",
        { type: "blank" as const, correctAnswer: "nimmt" },
        " gern ein Stück Kuchen. ",
        { type: "blank" as const, correctAnswer: "Die" },
        " Familie ",
        { type: "blank" as const, correctAnswer: "macht" },
        " das Abendessen gemeinsam."
      ] as TextPartType[]
    },
    {
      title: "Teil 3: Ein Tag in der Familie",
      description: "Trong phần này, bạn sẽ dùng các động từ: aufstehen, fahren, arbeiten, lernen, treffen, gehen, erzählen, schlafen.",
      textParts: [
        "Am Morgen ",
        { type: "blank" as const, correctAnswer: "stehen" },
        " wir alle früh ",
        { type: "blank" as const, correctAnswer: "auf" },
        ". Der Vater ",
        { type: "blank" as const, correctAnswer: "fährt" },
        " zur Arbeit mit dem Auto. Die Mutter ",
        { type: "blank" as const, correctAnswer: "arbeitet" },
        " im Büro. Wir Kinder ",
        { type: "blank" as const, correctAnswer: "lernen" },
        " in der Schule. Am Nachmittag ",
        { type: "blank" as const, correctAnswer: "treffen" },
        " wir Freunde im Park. Abends ",
        { type: "blank" as const, correctAnswer: "gehen" },
        " wir nach Hause. Die Eltern ",
        { type: "blank" as const, correctAnswer: "erzählen" },
        " vom Tag. Um 22 Uhr ",
        { type: "blank" as const, correctAnswer: "schlafen" },
        " alle."
      ] as TextPartType[]
    }
  ]
};

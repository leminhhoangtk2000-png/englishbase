// Data for Teil 2: W-Fragen - Ghép câu hỏi với câu trả lời exercises

export interface MatchingExercise {
  title: string;
  questions: string[];
  answers: string[];
  correctPairs: [number, number][];
}

export const teil2UbungsFragenData: MatchingExercise[] = [
  {
    title: "Phần 1: Câu 1-5",
    questions: [
      "Wo wohnst du?",
      "Wie alt bist du?",
      "Was machst du gern?",
      "Warum lernst du Deutsch?",
      "Wer ist dein bester Freund?",
    ],
    answers: [
      "Ich spiele gern Fußball.",
      "Ich wohne in Hamburg.",
      "Mein bester Freund heißt Tim.",
      "Ich bin 20 Jahre alt.",
      "Weil ich in Deutschland arbeiten will.",
    ],
    correctPairs: [
      [0, 1], // 1 → b)
      [1, 3], // 2 → d)
      [2, 0], // 3 → a)
      [3, 4], // 4 → e)
      [4, 2], // 5 → c)
    ],
  },
  {
    title: "Phần 2: Câu 6-10",
    questions: [
      "What trinkst du am Morgen?",
      "Wohin fährst du in den Urlaub?",
      "Was ist dein Lieblingsessen?",
      "Wie kommst du zur Schule?",
      "Wann beginnt dein Unterricht?",
    ],
    answers: [
      "Mit dem Fahrrad.",
      "Ich trinke Kaffee.",
      "Um 8 Uhr.",
      "Nach Spanien.",
      "Pizza.",
    ],
    correctPairs: [
      [0, 1], // 6 → b)
      [1, 3], // 7 → d)
      [2, 4], // 8 → e)
      [3, 0], // 9 → a)
      [4, 2], // 10 → c)
    ],
  },
  {
    title: "Phần 3: Câu 11-15",
    questions: [
      "Was machst du am Wochenende?",
      "Wo arbeitet dein Vater?",
      "Welche Sprache sprichst du?",
      "Wie viele Geschwister hast du?",
      "Was kaufst du im Supermarkt?",
    ],
    answers: [
      "Ich spreche Englisch und Deutsch.",
      "Ich treffe meine Freunde.",
      "Obst und Gemüse.",
      "In einer Firma.",
      "Zwei, eine Schwester und einen Bruder.",
    ],
    correctPairs: [
      [0, 1], // 11 → b)
      [1, 3], // 12 → d)
      [2, 0], // 13 → a)
      [3, 4], // 14 → e)
      [4, 2], // 15 → c)
    ],
  },
  {
    title: "Phần 4: Câu 16-20",
    questions: [
      "Woher kommt dein Lehrer?",
      "Mit wem gehst du ins Kino?",
      "Welche Musik hörst du gerne?",
      "Wo kaufst du deine Kleidung?",
      "Warum bist du müde?",
    ],
    answers: [
      "Popmusik.",
      "Aus Österreich.",
      "Im Einkaufszentrum.",
      "Mit meiner besten Freundin.",
      "Weil ich gestern spät ins Bett gegangen bin.",
    ],
    correctPairs: [
      [0, 1], // 16 → b)
      [1, 3], // 17 → d)
      [2, 0], // 18 → a)
      [3, 2], // 19 → c)
      [4, 4], // 20 → e)
    ],
  },
  {
    title: "Phần 5: Câu 21-25",
    questions: [
      "Was machst du nach der Schule?",
      "Was hast du in deiner Tasche?",
      "Wo kann man gut essen?",
      "Warum lachst du?",
      "Welche Sportart magst du?",
    ],
    answers: [
      "In einem Restaurant in der Stadt.",
      "Ich mag Tennis und Basketball.",
      "Ich mache meine Hausaufgaben.",
      "Mein Handy und ein Buch.",
      "Weil ich einen lustigen Witz gehört habe.",
    ],
    correctPairs: [
      [0, 2], // 21 → c)
      [1, 3], // 22 → d)
      [2, 0], // 23 → a)
      [3, 4], // 24 → e)
      [4, 1], // 25 → b)
    ],
  },
];

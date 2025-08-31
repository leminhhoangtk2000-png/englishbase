// Exercise metadata for system use
export const exerciseMetadata = {
  "a1/einkaufen-teil-1": {
    title: "Lektion 4 - Einkaufen teil 1",
    level: "A1",
    skill: "Nghe",
    difficulty: "Cơ bản",
    duration: "15 phút",
    image: "/images/exercises/shopping-german.jpg",
    description: "Bài tập nghe hiểu về chủ đề mua sắm trong tiếng Đức",
    tags: ["Nghe", "Mua sắm", "Hội thoại"],
    author: "Cơ Bản",
    publish: true
  }
  // Add more exercises here
};

export function getExerciseMetadata(slug: string) {
  return exerciseMetadata[slug as keyof typeof exerciseMetadata];
}

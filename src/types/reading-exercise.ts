export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options?: string[]; // For multiple choice (A, B, C, D)
  correctAnswer: string; // For multiple choice: 'A', 'B', 'C', 'D' | For true/false: 'true', 'false'
  explanation?: string;
}

export interface ReadingExercise {
  id: string;
  title: string;
  articleId: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

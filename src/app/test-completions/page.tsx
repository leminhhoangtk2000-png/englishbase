import { ExerciseCompletionList } from '@/components/exercises/exercise-completion-list';

export default function CompletionsTestPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Bài tập đã hoàn thành
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Theo dõi tiến độ học tập và xem lại các bài tập đã hoàn thành
        </p>
      </div>
      
      <ExerciseCompletionList />
    </div>
  );
}

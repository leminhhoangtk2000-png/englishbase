import { ExerciseTable } from '@/components/exercises/exercise-table';

export default function TestExercise() {
  const testExercises = [
    {
      id: 1,
      german: "__ Tisch (sein) __ groß.",
      correctAnswer: ["Der", "ist"],
    },
    {
      id: 2,
      german: "__ Blume (haben) __ eine schöne Farbe.",
      correctAnswer: ["Die", "hat"],
    },
  ];

  return (
    <div className="p-4">
      <h1>Test Exercise Component</h1>
      <ExerciseTable
        title="Test Exercise"
        subtitle="Testing direct component render"
        exercises={testExercises}
      />
    </div>
  );
}

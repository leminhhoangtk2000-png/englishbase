'use client';

import React from 'react';
import { MatchingQuiz } from '@/components/exercises/matching-quiz';
import { ExerciseAuthor } from '@/components/exercises/exercise-author';
import { teil2UbungsFragenData } from '@/data/teil2-ubungsfragen-exercises';

export default function UbungsFragenTeil2Page() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Teil 2: W-Fragen - Ghép câu hỏi với câu trả lời
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Luyện tập ghép câu hỏi W-Fragen với câu trả lời phù hợp trong tiếng Đức
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
            Bài tập: Ghép câu hỏi với câu trả lời
          </h2>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300">
              Hãy ghép các câu hỏi ở cột A với câu trả lời phù hợp ở cột B. 
              Bài tập được chia thành 5 phần, mỗi phần có 5 câu hỏi.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {teil2UbungsFragenData.map((exercise, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
              <MatchingQuiz
                title={exercise.title}
                questions={exercise.questions}
                answers={exercise.answers}
                correctPairs={exercise.correctPairs}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <ExerciseAuthor name="Lonia" />
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-200">
            Tipps zum Lernen:
          </h3>
          <ul className="space-y-2 text-green-700 dark:text-green-300">
            <li>• Lesen Sie jede Frage sorgfältig durch</li>
            <li>• Achten Sie auf die W-Fragewörter (wo, was, wer, wie, etc.)</li>
            <li>• Die Antwort sollte logisch zur Frage passen</li>
            <li>• Bei Schwierigkeiten können Sie die Übung wiederholen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

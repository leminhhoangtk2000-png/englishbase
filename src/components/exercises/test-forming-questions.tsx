'use client';

import { FormingQuestions } from './forming-questions';

export function TestFormingQuestions() {
  const testStatements = [
    "Sie lernt Deutsch *in der Schule*.",
    "Er arbeitet *im Büro*.",
    "Wir fahren *nach Berlin*."
  ];

  const testCorrectQuestions = [
    "Wo lernt sie Deutsch?",
    "Wo arbeitet er?",
    "Wohin fahren wir?"
  ];

  return (
    <div className="p-4 border-2 border-green-500 rounded-lg">
      <h3 className="text-lg font-bold text-green-600 mb-4">TEST Component (Hard-coded data)</h3>
      <FormingQuestions
        title="Test W-Fragen Exercise"
        statements={testStatements}
        correctQuestions={testCorrectQuestions}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
  question: string;
  correctAnswer: 'Richtig' | 'Falsch';
}

interface TrueFalseQuizProps {
  title: string;
  questions: Question[];
}

export function TrueFalseQuiz({ title, questions }: TrueFalseQuizProps) {
  const [answers, setAnswers] = useState<{ [key: number]: 'Richtig' | 'Falsch' | null }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionIndex: number, answer: 'Richtig' | 'Falsch') => {
    if (!showResults) {
      setAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(answers).filter(key => answers[parseInt(key)] !== null).length;
  const correctCount = showResults
    ? Object.keys(answers).filter(key => {
        const idx = parseInt(key);
        return answers[idx] === questions[idx].correctAnswer;
      }).length
    : 0;

  return (
    <Card className="w-full bg-white dark:bg-slate-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden my-6">
      <CardHeader className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-base font-medium flex items-center gap-3 text-gray-800 dark:text-gray-100">
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold">
            ✓
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-4">
          {questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = showResults && userAnswer === q.correctAnswer;
            const isIncorrect = showResults && userAnswer && userAnswer !== q.correctAnswer;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  showResults
                    ? isCorrect
                      ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950'
                      : isIncorrect
                      ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium">
                        Frage {index + 1}
                      </span>
                      {showResults && (
                        <span className="flex items-center gap-1">
                          {isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : isIncorrect ? (
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
                      {q.question}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAnswer(index, 'Richtig')}
                        disabled={showResults}
                        variant={userAnswer === 'Richtig' ? 'default' : 'outline'}
                        className={`text-sm px-4 py-2 transition-all duration-200 ${
                          userAnswer === 'Richtig'
                            ? showResults && isCorrect
                              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white'
                              : showResults && isIncorrect
                              ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        ✓ Richtig
                      </Button>
                      <Button
                        onClick={() => handleAnswer(index, 'Falsch')}
                        disabled={showResults}
                        variant={userAnswer === 'Falsch' ? 'default' : 'outline'}
                        className={`text-sm px-4 py-2 transition-all duration-200 ${
                          userAnswer === 'Falsch'
                            ? showResults && isCorrect
                              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white'
                              : showResults && isIncorrect
                              ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        ✗ Falsch
                      </Button>
                    </div>
                  </div>
                </div>
                {showResults && isIncorrect && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-700 dark:text-gray-300">Đúng:</strong>{' '}
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        {q.correctAnswer}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-950 p-3 rounded-lg border border-purple-100 dark:border-purple-900">
          <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {showResults ? (
              <span className="flex items-center gap-2">
                <strong>Kết quả:</strong> {correctCount}/{questions.length} đúng
                {correctCount === questions.length && <span className="text-green-600 dark:text-green-400">🎉</span>}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <strong>Tiến độ:</strong> {answeredCount}/{questions.length} câu
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!showResults ? (
              <Button
                onClick={handleSubmit}
                disabled={answeredCount !== questions.length}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kiểm tra đáp án
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm px-4 py-2 rounded-md"
              >
                Làm lại
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

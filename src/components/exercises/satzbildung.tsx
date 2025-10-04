'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface SatzbildungProps {
  exercises: Array<{
    words: string[];
    correctSentence: string;
    instruction?: string;
  }>;
  title?: string;
}

export default function Satzbildung({ 
  exercises, 
  title = "Bài tập Viết lại Câu" 
}: SatzbildungProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetExercise = () => {
    setAnswers({});
    setShowResults(false);
  };

  const isCorrect = (index: number, answer: string) => {
    if (!answer || !exercises[index]) return false;
    const normalizedAnswer = answer.toLowerCase().trim().replace(/[.,!?]/g, '');
    const normalizedCorrect = exercises[index].correctSentence.toLowerCase().trim().replace(/[.,!?]/g, '');
    return normalizedAnswer === normalizedCorrect;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-background border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-gray-900 dark:text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {exercises.map((exercise, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <div className="mb-3">
                <p className="font-medium text-gray-900 dark:text-gray-100">Câu {index + 1}:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Từ cho sẵn:</span>
                  {exercise.words.map((word, wordIndex) => (
                    <span 
                      key={wordIndex} 
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
              
              <Textarea
                placeholder="Viết câu hoàn chỉnh tại đây..."
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                disabled={showResults}
                className={`min-h-[60px] bg-white dark:bg-background text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
                  showResults
                    ? isCorrect(index, answers[index] || '')
                      ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950'
                      : 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-950'
                    : ''
                }`}
              />
              
              {showResults && (
                <div className="mt-2 space-y-2">
                  {isCorrect(index, answers[index] || '') ? (
                    <div>
                      <p className="text-green-600 dark:text-green-400 text-sm">✅ Chính xác!</p>
                      {exercise.instruction && (
                        <p className="text-sm text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 p-2 rounded mt-2">
                          <strong>💡 Giải thích:</strong> {exercise.instruction}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-600 dark:text-red-400 text-sm">❌ Chưa chính xác</p>
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                        <strong>Đáp án:</strong> {exercise.correctSentence}
                      </p>
                      {exercise.instruction && (
                        <p className="text-sm text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 p-2 rounded mt-2">
                          <strong>💡 Giải thích:</strong> {exercise.instruction}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={checkAnswers} 
              disabled={showResults}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              Kiểm tra đáp án
            </Button>
            {showResults && (
              <Button 
                variant="outline" 
                onClick={resetExercise}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
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

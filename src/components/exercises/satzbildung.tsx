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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {exercises.map((exercise, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="mb-3">
                <p className="font-medium">Câu {index + 1}:</p>
                {exercise.instruction && (
                  <p className="text-sm text-gray-600 mb-2">{exercise.instruction}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm text-gray-700">Từ cho sẵn:</span>
                  {exercise.words.map((word, wordIndex) => (
                    <span 
                      key={wordIndex} 
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
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
                className={`min-h-[60px] ${
                  showResults
                    ? isCorrect(index, answers[index] || '')
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : ''
                }`}
              />
              
              {showResults && (
                <div className="mt-2">
                  {isCorrect(index, answers[index] || '') ? (
                    <p className="text-green-600 text-sm">✅ Chính xác!</p>
                  ) : (
                    <div>
                      <p className="text-red-600 text-sm">❌ Chưa chính xác</p>
                      <p className="text-green-600 text-sm mt-1">
                        <strong>Đáp án:</strong> {exercise.correctSentence}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <div className="flex gap-2 pt-4">
            <Button onClick={checkAnswers} disabled={showResults}>
              Kiểm tra đáp án
            </Button>
            {showResults && (
              <Button variant="outline" onClick={resetExercise}>
                Làm lại
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

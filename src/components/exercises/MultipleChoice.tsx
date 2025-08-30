"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw, HelpCircle } from 'lucide-react';

interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface MultipleChoiceQuestion {
  question: string;
  options: MultipleChoiceOption[];
  explanation?: string;
}

interface MultipleChoiceProps {
  title?: string;
  questions: MultipleChoiceQuestion[];
}

export default function MultipleChoice({ title, questions }: MultipleChoiceProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showFeedback) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleCheck = () => {
    setShowFeedback(true);
  };

  const handleReset = () => {
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowFeedback(false);
  };

  const correctCount = questions.reduce((count, question, qIndex) => {
    const selectedOption = selectedAnswers[qIndex];
    if (selectedOption >= 0 && question.options[selectedOption]?.isCorrect) {
      return count + 1;
    }
    return count;
  }, 0);

  const scorePercentage = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
  
  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-green-600';
    if (scorePercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="my-6 border-2 border-purple-100">
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <HelpCircle className="w-5 h-5" />
          {title || 'Bài tập trắc nghiệm'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {questions.map((question, qIndex) => {
            const selectedOption = selectedAnswers[qIndex];
            const isAnswered = selectedOption >= 0;
            const isCorrect = isAnswered && question.options[selectedOption]?.isCorrect;

            return (
              <div key={qIndex} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-medium mb-3 text-gray-800">
                  {qIndex + 1}. {question.question}
                </h4>
                
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isSelected = selectedOption === oIndex;
                    const showCorrect = showFeedback && option.isCorrect;
                    const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                    
                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelectAnswer(qIndex, oIndex)}
                        disabled={showFeedback}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          showCorrect
                            ? 'border-green-500 bg-green-50'
                            : showIncorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex-1">{option.text}</span>
                          {showFeedback && (
                            <span className="ml-2">
                              {option.isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : isSelected ? (
                                <XCircle className="w-5 h-5 text-red-600" />
                              ) : null}
                            </span>
                          )}
                        </div>
                        {showFeedback && option.explanation && (isSelected || option.isCorrect) && (
                          <div className="mt-2 text-sm text-gray-600 italic">
                            {option.explanation}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {showFeedback && question.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Giải thích:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nút điều khiển */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCheck}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={showFeedback}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Kiểm tra
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm lại
          </Button>
        </div>

        {/* Kết quả */}
        {showFeedback && (
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                Kết quả: <span className={getScoreColor()}>
                  {correctCount}/{questions.length} ({scorePercentage.toFixed(0)}%)
                </span>
              </p>
              
              {scorePercentage >= 80 && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="font-medium">Xuất sắc!</span>
                </div>
              )}
              
              {scorePercentage >= 60 && scorePercentage < 80 && (
                <div className="flex items-center text-yellow-600">
                  <span className="font-medium">Khá tốt!</span>
                </div>
              )}
              
              {scorePercentage < 60 && (
                <div className="flex items-center text-red-600">
                  <span className="font-medium">Cần cải thiện</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

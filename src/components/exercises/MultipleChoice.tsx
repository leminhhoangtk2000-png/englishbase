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
    if (scorePercentage >= 80) return 'text-green-600 dark:text-green-400';
    if (scorePercentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className="my-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {title || 'Câu hỏi trắc nghiệm'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 bg-white dark:bg-gray-900">
        <div className="space-y-6">
          {questions.map((question, qIndex) => {
            const selectedOption = selectedAnswers[qIndex];
            const isAnswered = selectedOption >= 0;
            const selectedAnswer = isAnswered ? question.options[selectedOption] : null;
            const isCorrect = selectedAnswer?.isCorrect || false;

            return (
              <div key={qIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  {qIndex + 1}. {question.question}
                </h3>
                
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => {
                    const isSelected = selectedOption === oIndex;
                    const showCorrect = showFeedback && option.isCorrect;
                    const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                    
                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelectAnswer(qIndex, oIndex)}
                        disabled={showFeedback}
                        className={`
                          w-full p-3 text-left rounded-lg border-2 transition-all duration-200 flex items-center justify-between
                          ${showCorrect 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                            : showIncorrect 
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                              : isSelected 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                          }
                        `}
                      >
                        <span className="font-medium">
                          {String.fromCharCode(65 + oIndex)}. {option.text}
                        </span>
                        
                        {showFeedback && (
                          <div className="flex items-center">
                            {option.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Hiển thị giải thích cho từng câu hỏi */}
                {showFeedback && question.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      <strong>Giải thích:</strong> {question.explanation}
                    </p>
                  </div>
                )}

                {/* Hiển thị giải thích cho từng đáp án */}
                {showFeedback && selectedAnswer?.explanation && (
                  <div className={`mt-4 p-3 border rounded-lg ${
                    isCorrect 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                  }`}>
                    <p className={`text-sm ${
                      isCorrect 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      <strong>
                        {isCorrect ? 'Chính xác!' : 'Không chính xác.'}
                      </strong> {selectedAnswer.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nút điều khiển */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleCheck}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            disabled={showFeedback}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Kiểm tra
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm lại
          </Button>
        </div>

        {/* Hiển thị kết quả tổng */}
        {showFeedback && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Kết quả: <span className={getScoreColor()}>
                  {correctCount}/{questions.length} ({scorePercentage.toFixed(0)}%)
                </span>
              </p>
              
              {scorePercentage >= 80 && (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="font-medium">Xuất sắc!</span>
                </div>
              )}
              
              {scorePercentage >= 60 && scorePercentage < 80 && (
                <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="font-medium">Tốt!</span>
                </div>
              )}
              
              {scorePercentage < 60 && (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <XCircle className="w-5 h-5 mr-1" />
                  <span className="font-medium">Cần cải thiện!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

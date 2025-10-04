'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface MultipleChoiceQuizProps {
  questions: Question[];
}

export function MultipleChoiceQuiz({ questions }: MultipleChoiceQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({});

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = (questionIndex: number) => {
    setShowResults(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };

  const resetQuestion = (questionIndex: number) => {
    setSelectedAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionIndex];
      return newAnswers;
    });
    setShowResults(prev => {
      const newResults = { ...prev };
      delete newResults[questionIndex];
      return newResults;
    });
  };

  return (
    <div className="space-y-6 my-8">
      {questions.map((question, questionIndex) => {
        const isAnswered = showResults[questionIndex];
        const selectedAnswer = selectedAnswers[questionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;

        return (
          <Card key={questionIndex} className="w-full bg-white dark:bg-background shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-background border-b border-gray-200 dark:border-gray-800">
              <CardTitle className="text-base font-medium flex items-center gap-3 text-gray-800 dark:text-gray-100">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold">
                  {questionIndex + 1}
                </span>
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
                  let buttonClass = "w-full justify-start text-left h-auto p-3 border transition-all duration-200";
                  let icon = null;

                  if (isAnswered) {
                    if (option === question.correctAnswer) {
                      buttonClass += " bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950";
                      icon = <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
                    } else if (option === selectedAnswer && !isCorrect) {
                      buttonClass += " bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950";
                      icon = <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
                    } else {
                      buttonClass += " bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400";
                    }
                  } else if (selectedAnswer === option) {
                    buttonClass += " bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300";
                  } else {
                    buttonClass += " hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300";
                  }

                  return (
                    <Button
                      key={optionIndex}
                      variant="outline"
                      className={buttonClass}
                      onClick={() => !isAnswered && handleAnswerSelect(questionIndex, option)}
                      disabled={isAnswered}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm">{option}</span>
                        {icon}
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                {!isAnswered ? (
                  <Button 
                    onClick={() => handleSubmit(questionIndex)}
                    disabled={!selectedAnswer}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md"
                  >
                    Kiểm tra đáp án
                  </Button>
                ) : (
                  <Button 
                    onClick={() => resetQuestion(questionIndex)}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm px-4 py-2 rounded-md"
                  >
                    Làm lại
                  </Button>
                )}
              </div>

              {isAnswered && (
                <div className={`p-3 rounded-md border ${
                  isCorrect 
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                }`}>
                  <p className={`text-sm font-medium ${
                    isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                  }`}>
                    {isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng'}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <strong>Đáp án:</strong> {question.correctAnswer}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

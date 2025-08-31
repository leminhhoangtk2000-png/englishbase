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
    <div className="space-y-8 my-10">
      {questions.map((question, questionIndex) => {
        const isAnswered = showResults[questionIndex];
        const selectedAnswer = selectedAnswers[questionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;

        return (
          <Card key={questionIndex} className="w-full bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardTitle className="text-lg font-semibold flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {questionIndex + 1}
                </span>
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                  let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
                  let buttonClass = "w-full justify-start text-left h-auto p-4 border-2 transition-all duration-200";
                  let icon = null;

                  if (isAnswered) {
                    if (option === question.correctAnswer) {
                      buttonClass += " bg-green-50 border-green-200 text-green-800 hover:bg-green-100";
                      icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                    } else if (option === selectedAnswer && !isCorrect) {
                      buttonClass += " bg-red-50 border-red-200 text-red-800 hover:bg-red-100";
                      icon = <XCircle className="w-5 h-5 text-red-600" />;
                    } else {
                      buttonClass += " bg-gray-50 border-gray-200 text-gray-600";
                    }
                  } else if (selectedAnswer === option) {
                    buttonClass += " bg-purple-50 border-purple-300 text-purple-800 shadow-md";
                  } else {
                    buttonClass += " hover:bg-purple-50 hover:border-purple-200 hover:shadow-md";
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
                        <span className="font-medium">{option}</span>
                        {icon}
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                {!isAnswered ? (
                  <Button 
                    onClick={() => handleSubmit(questionIndex)}
                    disabled={!selectedAnswer}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg"
                  >
                    ✨ Kiểm tra đáp án
                  </Button>
                ) : (
                  <Button 
                    onClick={() => resetQuestion(questionIndex)}
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-6 py-2 rounded-xl"
                  >
                    🔄 Làm lại
                  </Button>
                )}
              </div>

              {isAnswered && (
                <div className={`p-4 rounded-xl border-2 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`font-semibold ${
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isCorrect ? '🎉 Xuất sắc! Bạn đã trả lời đúng!' : '💪 Chưa chính xác, hãy thử lại!'}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-gray-600 mt-2">
                      💡 <strong>Đáp án đúng:</strong> {question.correctAnswer}
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

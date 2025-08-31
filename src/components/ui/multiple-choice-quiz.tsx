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
    <div className="space-y-6">
      {questions.map((question, questionIndex) => {
        const isAnswered = showResults[questionIndex];
        const selectedAnswer = selectedAnswers[questionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;

        return (
          <Card key={questionIndex} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
                  let icon = null;

                  if (isAnswered) {
                    if (option === question.correctAnswer) {
                      buttonVariant = "default";
                      icon = <CheckCircle className="w-4 h-4 text-green-600" />;
                    } else if (option === selectedAnswer && !isCorrect) {
                      buttonVariant = "destructive";
                      icon = <XCircle className="w-4 h-4 text-red-600" />;
                    }
                  } else if (selectedAnswer === option) {
                    buttonVariant = "secondary";
                  }

                  return (
                    <Button
                      key={optionIndex}
                      variant={buttonVariant}
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => !isAnswered && handleAnswerSelect(questionIndex, option)}
                      disabled={isAnswered}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{option}</span>
                        {icon}
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                {!isAnswered ? (
                  <Button 
                    onClick={() => handleSubmit(questionIndex)}
                    disabled={!selectedAnswer}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Kiểm tra đáp án
                  </Button>
                ) : (
                  <Button 
                    onClick={() => resetQuestion(questionIndex)}
                    variant="outline"
                  >
                    Làm lại
                  </Button>
                )}
              </div>

              {isAnswered && (
                <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '✅ Chính xác!' : '❌ Sai rồi!'}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-gray-600 mt-1">
                      Đáp án đúng: <strong>{question.correctAnswer}</strong>
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

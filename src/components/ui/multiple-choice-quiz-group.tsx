'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface MultipleChoiceQuizGroupProps {
  questions: Question[];
  title?: string;
}

export function MultipleChoiceQuizGroup({ questions, title }: MultipleChoiceQuizGroupProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  const handleSubmitAll = () => {
    // Scroll to top to see the result summary
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };

  const score = showResults ? calculateScore() : null;
  const allAnswered = questions.every((_, index) => selectedAnswers[index] !== undefined);

  return (
    <Card className="my-8 border-2 dark:border-gray-800 shadow-lg overflow-hidden dark:bg-background">
      {/* Header with Title */}
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black border-b-2 border-blue-200 dark:border-gray-800">
        {title && (
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-md">
              {questions.length}
            </div>
            <span>{title}</span>
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="p-6 space-y-6 dark:bg-background">
        {/* Progress Indicator */}
        {!showResults && (
          <div className="bg-blue-50 dark:bg-gray-900 border border-blue-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Đã chọn: {Object.keys(selectedAnswers).length}/{questions.length} câu
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                {allAnswered ? '✓ Đã hoàn thành!' : 'Hãy chọn tất cả câu trả lời'}
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-gray-800 rounded-full h-2.5">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((question, questionIndex) => {
            const selectedAnswer = selectedAnswers[questionIndex];
            const isCorrect = selectedAnswer === question.correctAnswer;
            const isAnswered = selectedAnswer !== undefined;

            return (
              <Card 
                key={questionIndex} 
                className={`transition-all dark:bg-background ${
                  showResults && isAnswered 
                    ? (isCorrect ? 'border-2 border-green-400 dark:border-green-600 bg-green-50/30 dark:bg-green-950/30' : 'border-2 border-red-400 dark:border-red-600 bg-red-50/30 dark:bg-red-950/30')
                    : isAnswered 
                      ? 'border-2 border-blue-300 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-950/30'
                      : 'border border-gray-200 dark:border-gray-800'
                }`}
              >
                <CardHeader className="bg-gray-50/50 dark:bg-background border-b dark:border-gray-800 py-3 px-4">
                  <CardTitle className="text-base font-medium flex items-center gap-3">
                    <span className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold ${
                      showResults && isAnswered
                        ? (isCorrect ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300')
                        : isAnswered
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {questionIndex + 1}
                    </span>
                    <span className="flex-1 text-gray-800 dark:text-gray-200">{question.question}</span>
                    {showResults && isAnswered && (
                      isCorrect 
                        ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2 dark:bg-background">
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      let buttonClass = "w-full justify-start text-left h-auto p-3 border transition-all duration-200";
                      let icon = null;

                      if (showResults) {
                        if (option === question.correctAnswer) {
                          buttonClass += " bg-green-50 dark:bg-green-950 border-green-400 dark:border-green-700 text-green-900 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950 font-semibold shadow-sm";
                          icon = <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
                        } else if (option === selectedAnswer && !isCorrect) {
                          buttonClass += " bg-red-50 dark:bg-red-950 border-red-400 dark:border-red-700 text-red-900 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 font-medium";
                          icon = <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
                        } else {
                          buttonClass += " bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-600 opacity-60";
                        }
                      } else if (selectedAnswer === option) {
                        buttonClass += " bg-blue-50 dark:bg-blue-950 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-blue-300 font-medium shadow-sm";
                      } else {
                        buttonClass += " hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm";
                      }

                      return (
                        <Button
                          key={optionIndex}
                          variant="outline"
                          className={buttonClass}
                          onClick={() => handleAnswerSelect(questionIndex, option)}
                          disabled={showResults}
                        >
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="text-sm flex-1 text-left">{option}</span>
                            {icon}
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Explanation for wrong answers */}
                  {showResults && isAnswered && !isCorrect && (
                    <div className="mt-3 p-3 rounded-md bg-amber-50 border border-amber-200 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900 mb-1">
                          Giải thích:
                        </p>
                        <p className="text-sm text-amber-800">
                          Câu trả lời đúng là <strong>"{question.correctAnswer}"</strong>. Hãy xem lại cấu trúc ngữ pháp để hiểu rõ hơn.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-4 bg-white/95 dark:bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-800">
          {!showResults ? (
            <div className="space-y-3">
              <Button 
                onClick={handleSubmitAll}
                disabled={!allAnswered}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold py-6 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {allAnswered 
                  ? `✓ Kiểm tra tất cả ${questions.length} câu` 
                  : `Chọn đủ ${questions.length} câu để kiểm tra (${Object.keys(selectedAnswers).length}/${questions.length})`
                }
              </Button>
              {Object.keys(selectedAnswers).length > 0 && (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 py-4 rounded-lg"
                >
                  Xóa tất cả
                </Button>
              )}
            </div>
          ) : null}
        </div>

        {/* Results Summary - Show at bottom after submission */}
        {showResults && score && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black border-2 border-blue-300 dark:border-blue-800 shadow-xl mt-6">
            <CardContent className="p-6 dark:bg-background">
              <div className="text-center space-y-4">
                <div className={`text-6xl ${
                  score.percentage >= 80 ? 'text-green-600 dark:text-green-400' : 
                  score.percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {score.percentage >= 80 ? '🎉' : score.percentage >= 50 ? '👍' : '💪'}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                    Kết quả: {score.correct}/{score.total} câu đúng
                  </h4>
                  <p className="text-xl text-blue-700 dark:text-blue-400 font-semibold">
                    Điểm số: {score.percentage}%
                  </p>
                </div>
                <div className="pt-4 border-t border-blue-200 dark:border-gray-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    {score.percentage >= 80 
                      ? '🌟 Xuất sắc! Bạn đã nắm vững kiến thức!'
                      : score.percentage >= 50
                        ? '👏 Tốt lắm! Hãy xem lại các câu sai để cải thiện.'
                        : '📚 Hãy xem lại lý thuyết và thử lại nhé!'}
                  </p>
                  <Button 
                    onClick={handleReset}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-700 dark:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white font-semibold py-4 rounded-lg shadow-md transition-all"
                  >
                    🔄 Làm lại bài tập
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

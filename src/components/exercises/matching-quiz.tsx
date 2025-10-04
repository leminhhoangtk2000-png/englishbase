'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw, Play } from 'lucide-react';

interface MatchingQuizProps {
  title: string;
  questions: string[];
  answers: string[];
  correctPairs: [number, number][]; // [questionIndex, answerIndex]
}

export function MatchingQuiz({ title, questions, answers, correctPairs }: MatchingQuizProps) {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [userMatches, setUserMatches] = useState<{ [questionIndex: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleQuestionClick = (questionIndex: number) => {
    if (showResults) return;
    
    if (selectedQuestionIndex === questionIndex) {
      // Deselect if clicking the same question
      setSelectedQuestionIndex(null);
    } else {
      setSelectedQuestionIndex(questionIndex);
    }
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (showResults || selectedQuestionIndex === null) return;

    setUserMatches(prev => ({
      ...prev,
      [selectedQuestionIndex]: answerIndex
    }));
    
    setSelectedQuestionIndex(null);
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setUserMatches({});
    setShowResults(false);
    setSelectedQuestionIndex(null);
    setIsStarted(false);
  };

  const getQuestionResult = (questionIndex: number): 'correct' | 'incorrect' | 'unanswered' => {
    if (!showResults) return 'unanswered';
    
    const userAnswer = userMatches[questionIndex];
    if (userAnswer === undefined) return 'unanswered';
    
    const correctAnswer = correctPairs.find(([qIdx]) => qIdx === questionIndex)?.[1];
    return userAnswer === correctAnswer ? 'correct' : 'incorrect';
  };

  const getAnswerResult = (answerIndex: number): 'correct' | 'incorrect' | 'unused' => {
    if (!showResults) return 'unused';
    
    // Check if this answer is used by any question
    const questionUsingThisAnswer = Object.entries(userMatches).find(
      ([_, aIdx]) => aIdx === answerIndex
    );
    
    if (!questionUsingThisAnswer) return 'unused';
    
    const questionIndex = parseInt(questionUsingThisAnswer[0]);
    const correctAnswer = correctPairs.find(([qIdx]) => qIdx === questionIndex)?.[1];
    
    return answerIndex === correctAnswer ? 'correct' : 'incorrect';
  };

  const getScore = (): { correct: number; total: number } => {
    let correct = 0;
    questions.forEach((_, questionIndex) => {
      if (getQuestionResult(questionIndex) === 'correct') {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  const allAnswered = Object.keys(userMatches).length === questions.length;
  const { correct, total } = getScore();

  if (!isStarted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <p className="text-muted-foreground">
            Ghép {questions.length} câu hỏi với đáp án phù hợp
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleStart} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Bắt đầu bài tập
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {showResults && (
            <Badge variant={correct === total ? "default" : "secondary"} className="text-lg px-3 py-1">
              {correct}/{total} đúng
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {showResults 
            ? "Kết quả bài tập - Xem các cặp đúng và sai" 
            : "Chọn một câu hỏi (màu xanh), sau đó chọn đáp án phù hợp (màu cam)"
          }
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Questions Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400">Câu hỏi (A)</h3>
            {questions.map((question, questionIndex) => {
              const result = getQuestionResult(questionIndex);
              const isSelected = selectedQuestionIndex === questionIndex;
              const userAnswer = userMatches[questionIndex];
              const hasAnswer = userAnswer !== undefined;
              
              return (
                <div
                  key={questionIndex}
                  onClick={() => handleQuestionClick(questionIndex)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all duration-200 relative
                    ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                    ${showResults && result === 'correct' ? 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400' : ''}
                    ${showResults && result === 'incorrect' ? 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-400' : ''}
                    ${showResults && result === 'unanswered' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-400' : ''}
                    ${!showResults && hasAnswer ? 'border-green-400 bg-green-50 dark:bg-green-950 dark:border-green-400' : ''}
                    ${!showResults && !isSelected && !hasAnswer ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-25 dark:hover:bg-blue-950' : ''}
                  `}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-blue-700 dark:text-blue-400 min-w-[24px]">
                      {questionIndex + 1}.
                    </span>
                    <span className="flex-1 dark:text-gray-100">{question}</span>
                    
                    {/* Connection indicator */}
                    {hasAnswer && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">→ {String.fromCharCode(97 + userAnswer)}</span>
                        {showResults && (
                          result === 'correct' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Show connected answer in results */}
                  {showResults && hasAnswer && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Bạn chọn: </span>
                        <span className={result === 'correct' ? 'text-green-700 dark:text-green-400 font-medium' : 'text-red-700 dark:text-red-400'}>
                          {answers[userAnswer]}
                        </span>
                      </div>
                      {result === 'incorrect' && (
                        <div className="text-sm mt-1">
                          <span className="text-muted-foreground">Đáp án đúng: </span>
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            {answers[correctPairs.find(([qIdx]) => qIdx === questionIndex)?.[1] || 0]}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Answers Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-3 text-orange-700 dark:text-orange-400">Đáp án (B)</h3>
            {answers.map((answer, answerIndex) => {
              const result = getAnswerResult(answerIndex);
              const isUsed = Object.values(userMatches).includes(answerIndex);
              
              return (
                <div
                  key={answerIndex}
                  onClick={() => handleAnswerClick(answerIndex)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all duration-200
                    ${showResults && result === 'correct' ? 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400' : ''}
                    ${showResults && result === 'incorrect' ? 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-400' : ''}
                    ${showResults && result === 'unused' ? 'border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-700' : ''}
                    ${!showResults && isUsed ? 'border-green-400 bg-green-50 dark:bg-green-950 dark:border-green-400' : ''}
                    ${!showResults && !isUsed ? 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-25 dark:hover:bg-orange-950' : ''}
                    ${selectedQuestionIndex !== null && !showResults && !isUsed ? 'hover:border-orange-400 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950' : ''}
                  `}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-orange-700 dark:text-orange-400 min-w-[24px]">
                      {String.fromCharCode(97 + answerIndex)})
                    </span>
                    <span className="flex-1 dark:text-gray-100">{answer}</span>
                    
                    {showResults && (
                      result === 'correct' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : result === 'incorrect' ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : null
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 justify-center">
          {!showResults ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!allAnswered}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Kiểm tra ({Object.keys(userMatches).length}/{questions.length})
            </Button>
          ) : (
            <Button 
              onClick={handleReset} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Làm lại
            </Button>
          )}
        </div>

        {showResults && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <h4 className="font-semibold mb-2 dark:text-gray-100">Thống kê kết quả:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correct}</div>
                <div className="text-muted-foreground">Đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{total - correct}</div>
                <div className="text-muted-foreground">Sai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((correct / total) * 100)}%
                </div>
                <div className="text-muted-foreground">Điểm số</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{total}</div>
                <div className="text-muted-foreground">Tổng số</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

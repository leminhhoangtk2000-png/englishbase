'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Exercise {
  id: number;
  german: string;
  correctAnswer: string | string[]; // Support both single answer and multiple answers
  explanation?: string; // Optional explanation in Vietnamese
}

interface ExerciseTableProps {
  title: string;
  subtitle?: string;
  exercises: Exercise[];
}

export function ExerciseTable({ title, subtitle, exercises }: ExerciseTableProps) {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string[] }>({});
  const [checkedAnswers, setCheckedAnswers] = useState<{ [key: number]: boolean }>({});
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get number of blanks in a sentence
  const getBlankCount = (german: string) => {
    return (german.match(/__/g) || []).length;
  };

  // Parse sentence into parts with blanks
  const parseSentence = (german: string) => {
    return german.split('__');
  };

  // Get correct answers array
  const getCorrectAnswers = (exercise: Exercise) => {
    if (Array.isArray(exercise.correctAnswer)) {
      return exercise.correctAnswer;
    }
    // Split by space to handle "Der ist", "Die hat", etc.
    return exercise.correctAnswer.split(' ').filter(answer => answer.length > 0);
  };

  const handleInputChange = (exerciseId: number, blankIndex: number, value: string) => {
    setUserAnswers(prev => {
      const currentAnswers = prev[exerciseId] || [];
      const newAnswers = [...currentAnswers];
      newAnswers[blankIndex] = value;
      return {
        ...prev,
        [exerciseId]: newAnswers
      };
    });
  };

  // Calculate input width based on content
  const getInputWidth = (value: string, correctAnswer: string) => {
    // Base minimum width
    const minWidth = 80; // 80px minimum
    // Calculate width based on longer of user input or correct answer
    const longerText = value.length > correctAnswer.length ? value : correctAnswer;
    // Approximate 8px per character + padding
    const calculatedWidth = Math.max(minWidth, (longerText.length * 10) + 20);
    return `${calculatedWidth}px`;
  };

  const checkAnswers = () => {
    const newCheckedAnswers: { [key: number]: boolean } = {};
    exercises.forEach(exercise => {
      const userAnswerArray = userAnswers[exercise.id] || [];
      const correctAnswers = getCorrectAnswers(exercise);
      
      // Check if all answers match
      const isCorrect = userAnswerArray.length === correctAnswers.length && 
        userAnswerArray.every((answer, index) => 
          answer.trim().toLowerCase() === correctAnswers[index].toLowerCase()
        );
      
      newCheckedAnswers[exercise.id] = isCorrect;
    });
    setCheckedAnswers(newCheckedAnswers);
    setShowResults(true);
  };

  const resetExercise = () => {
    setUserAnswers({});
    setCheckedAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    const correctCount = Object.values(checkedAnswers).filter(Boolean).length;
    return `${correctCount}/${exercises.length}`;
  };

  if (!mounted) {
    return (
      <Card className="w-full max-w-4xl mx-auto my-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {exercises.map((exercise) => {
            const isCorrect = checkedAnswers[exercise.id];
            const sentenceParts = parseSentence(exercise.german);
            const blankCount = getBlankCount(exercise.german);
            const currentAnswers = userAnswers[exercise.id] || Array.from({ length: blankCount }, () => '');
            const correctAnswers = getCorrectAnswers(exercise);
            
            return (
              <div key={exercise.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge variant="outline" className="min-w-[30px] text-center mt-1">
                  {exercise.id}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-1 mb-2">
                    {sentenceParts.map((part, partIndex) => (
                      <React.Fragment key={partIndex}>
                        <span className="text-sm">{part}</span>
                        {partIndex < sentenceParts.length - 1 && (
                          <Input
                            value={currentAnswers[partIndex] || ''}
                            onChange={(e) => handleInputChange(exercise.id, partIndex, e.target.value)}
                            style={{ 
                              width: getInputWidth(
                                currentAnswers[partIndex] || '', 
                                correctAnswers[partIndex] || ''
                              )
                            }}
                            className={`mx-1 transition-all duration-200 ${
                              showResults
                                ? currentAnswers[partIndex]?.trim().toLowerCase() === correctAnswers[partIndex]?.toLowerCase()
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                                : ''
                            }`}
                            placeholder="..."
                            disabled={showResults}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  {showResults && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        {isCorrect ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Đúng rồi!</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span>Đáp án đúng: {correctAnswers.join(' ')}</span>
                            </div>
                            {exercise.explanation && (
                              <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-200 mt-1">
                                <strong>💡 Giải thích:</strong> {exercise.explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button onClick={checkAnswers} disabled={showResults}>
              Kiểm tra
            </Button>
            <Button variant="outline" onClick={resetExercise}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Làm lại
            </Button>
          </div>
          
          {showResults && (
            <div className="text-right">
              <Badge variant="secondary" className="text-sm">
                Điểm số: {calculateScore()}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
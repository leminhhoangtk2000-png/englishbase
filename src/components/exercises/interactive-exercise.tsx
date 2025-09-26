'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface Exercise {
  id: number;
  german: string;
  correctAnswer: string;
  hint?: string;
}

interface InteractiveExerciseProps {
  title: string;
  subtitle?: string;
  exercises: Exercise[];
}

export function InteractiveExercise({ title, subtitle, exercises }: InteractiveExerciseProps) {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [checkedAnswers, setCheckedAnswers] = useState<{ [key: number]: boolean }>({});
  const [showResults, setShowResults] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const handleAnswerChange = (exerciseId: number, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseId]: value
    }));
    
    // Reset check status when answer changes
    if (checkedAnswers[exerciseId]) {
      setCheckedAnswers(prev => ({
        ...prev,
        [exerciseId]: false
      }));
    }
  };

  const checkSingleAnswer = (exerciseId: number) => {
    const userAnswer = (userAnswers[exerciseId] || '').trim().toLowerCase();
    const correctAnswer = exercises.find(ex => ex.id === exerciseId)?.correctAnswer.toLowerCase();
    
    setCheckedAnswers(prev => ({
      ...prev,
      [exerciseId]: true
    }));
    
    return userAnswer === correctAnswer;
  };

  const checkAllAnswers = () => {
    let correct = 0;
    const newCheckedAnswers: { [key: number]: boolean } = {};
    
    exercises.forEach(exercise => {
      newCheckedAnswers[exercise.id] = true;
      const userAnswer = (userAnswers[exercise.id] || '').trim().toLowerCase();
      const correctAnswer = exercise.correctAnswer.toLowerCase();
      
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });
    
    setCheckedAnswers(newCheckedAnswers);
    setStats({ correct, total: exercises.length });
    setShowResults(true);
  };

  const resetAll = () => {
    setUserAnswers({});
    setCheckedAnswers({});
    setShowResults(false);
    setShowAnswers(false);
    setStats({ correct: 0, total: 0 });
  };

  const toggleShowAnswers = () => {
    setShowAnswers(prev => !prev);
  };

  const isCorrect = (exerciseId: number) => {
    const userAnswer = (userAnswers[exerciseId] || '').trim().toLowerCase();
    const correctAnswer = exercises.find(ex => ex.id === exerciseId)?.correctAnswer.toLowerCase();
    return userAnswer === correctAnswer;
  };

  const getScoreColor = () => {
    const percentage = (stats.correct / stats.total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-5xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        {subtitle && (
          <p className="text-center text-muted-foreground">{subtitle}</p>
        )}
        
        {showResults && (
          <div className="text-center mt-4">
            <Badge variant="outline" className={`text-lg px-4 py-2 ${getScoreColor()}`}>
              Kết quả: {stats.correct}/{stats.total} ({Math.round((stats.correct / stats.total) * 100)}%)
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={checkAllAnswers} className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Kiểm tra tất cả
          </Button>
          <Button variant="outline" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm lại
          </Button>
          <Button variant="outline" onClick={toggleShowAnswers}>
            {showAnswers ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showAnswers ? 'Ẩn đáp án' : 'Hiện đáp án'}
          </Button>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {exercises.map((exercise) => {
            const isChecked = checkedAnswers[exercise.id];
            const isAnswerCorrect = isCorrect(exercise.id);
            
            // Parse German text to create input fields
            const parts = exercise.german.split('_____');
            
            return (
              <div 
                key={exercise.id} 
                className={`p-4 border rounded-lg transition-colors ${
                  isChecked 
                    ? isAnswerCorrect 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                      : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Exercise Number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isChecked
                      ? isAnswerCorrect
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {exercise.id}
                  </div>
                  
                  {/* Exercise Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-lg">
                      <span>{parts[0]}</span>
                      <Input
                        type="text"
                        value={userAnswers[exercise.id] || ''}
                        onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                        className={`inline-block w-32 h-8 text-center ${
                          isChecked 
                            ? isAnswerCorrect 
                              ? 'border-green-500 bg-green-50 dark:bg-green-950/50' 
                              : 'border-red-500 bg-red-50 dark:bg-red-950/50'
                            : ''
                        }`}
                        placeholder="..."
                      />
                      <span>{parts[1]}</span>
                      
                      {/* Show correct answer if requested */}
                      {showAnswers && (
                        <Badge variant="secondary" className="ml-2">
                          Đáp án: {exercise.correctAnswer}
                        </Badge>
                      )}
                      
                      {/* Result Icon */}
                      {isChecked && (
                        <div className="ml-2">
                          {isAnswerCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Hint */}
                    {exercise.hint && (
                      <p className="text-sm text-muted-foreground mt-2">
                        💡 {exercise.hint}
                      </p>
                    )}
                    
                    {/* Show correct answer when wrong */}
                    {isChecked && !isAnswerCorrect && !showAnswers && (
                      <p className="text-sm text-red-600 mt-2">
                        Đáp án đúng: <strong>{exercise.correctAnswer}</strong>
                      </p>
                    )}
                  </div>
                  
                  {/* Individual Check Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => checkSingleAnswer(exercise.id)}
                    disabled={isChecked}
                  >
                    {isChecked ? 'Đã kiểm tra' : 'Kiểm tra'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Summary */}
        {showResults && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-semibold mb-2">Tóm tắt kết quả:</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                <div className="text-sm text-muted-foreground">Đúng</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.total - stats.correct}</div>
                <div className="text-sm text-muted-foreground">Sai</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${getScoreColor()}`}>
                  {Math.round((stats.correct / stats.total) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Điểm</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

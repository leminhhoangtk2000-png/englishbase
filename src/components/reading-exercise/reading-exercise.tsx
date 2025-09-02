'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy,
  Clock,
  Target 
} from 'lucide-react';
import { ReadingExercise, QuizQuestion } from '@/types/reading-exercise';
import { MultipleChoiceQuestion } from './multiple-choice-question';
import { TrueFalseQuestion } from './true-false-question';

interface ReadingExerciseComponentProps {
  exercise: ReadingExercise;
}

interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
}

export function ReadingExerciseComponent({ exercise }: ReadingExerciseComponentProps) {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const handleAnswer = (questionId: string, answer: string, isCorrect: boolean) => {
    setUserAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId 
            ? { ...a, answer, isCorrect }
            : a
        );
      }
      return [...prev, { questionId, answer, isCorrect }];
    });
  };

  const handleSubmit = () => {
    if (userAnswers.length < exercise.questions.length) {
      alert('Vui lòng trả lời tất cả các câu hỏi!');
      return;
    }
    
    setEndTime(new Date());
    setShowResults(true);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setUserAnswers([]);
    setShowResults(false);
    setIsCompleted(false);
    setStartTime(new Date());
    setEndTime(null);
  };

  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const totalQuestions = exercise.questions.length;
  const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const completionTime = startTime && endTime 
    ? Math.round((endTime.getTime() - startTime.getTime()) / 1000)
    : 0;

  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-green-600';
    if (scorePercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = () => {
    if (scorePercentage >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (scorePercentage >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-8">
      {/* Exercise Header */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl text-gray-900 mb-1">
                  {exercise.title}
                </CardTitle>
                <p className="text-gray-600 text-sm">{exercise.description}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              {exercise.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{totalQuestions} câu hỏi</span>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{completionTime}s</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>Tiến độ:</span>
                <Progress 
                  value={(userAnswers.length / totalQuestions) * 100} 
                  className="flex-1 max-w-32"
                />
                <span className="text-xs">
                  {userAnswers.length}/{totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {showResults && (
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Trophy className={`w-6 h-6 ${getScoreColor()}`} />
              Kết quả bài tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor()}`}>
                  {scorePercentage.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Điểm số</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {correctCount}
                </div>
                <div className="text-sm text-gray-600">Câu đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {totalQuestions - correctCount}
                </div>
                <div className="text-sm text-gray-600">Câu sai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {completionTime}s
                </div>
                <div className="text-sm text-gray-600">Thời gian</div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Badge variant="outline" className={getScoreBadge()}>
                {scorePercentage >= 80 ? 'Xuất sắc!' : 
                 scorePercentage >= 60 ? 'Khá tốt!' : 'Cần cải thiện!'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {exercise.questions.map((question, index) => {
          const userAnswer = userAnswers.find(a => a.questionId === question.id);
          
          if (question.type === 'multiple-choice') {
            return (
              <MultipleChoiceQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                onAnswer={handleAnswer}
                showResult={showResults}
                userAnswer={userAnswer?.answer}
              />
            );
          } else {
            return (
              <TrueFalseQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                onAnswer={handleAnswer}
                showResult={showResults}
                userAnswer={userAnswer?.answer}
              />
            );
          }
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-8">
        {!showResults ? (
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={userAnswers.length < totalQuestions}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Nộp bài ({userAnswers.length}/{totalQuestions})
          </Button>
        ) : (
          <Button 
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm lại
          </Button>
        )}
      </div>
    </div>
  );
}

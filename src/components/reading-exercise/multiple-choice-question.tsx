'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '@/types/reading-exercise';
import { cn } from '@/lib/utils';

interface MultipleChoiceQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  onAnswer: (questionId: string, answer: string, isCorrect: boolean) => void;
  showResult?: boolean;
  userAnswer?: string;
}

export function MultipleChoiceQuestion({
  question,
  questionNumber,
  onAnswer,
  showResult = false,
  userAnswer
}: MultipleChoiceQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(userAnswer || '');
  const [hasAnswered, setHasAnswered] = useState(!!userAnswer);

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered && !showResult) return;
    
    setSelectedAnswer(answer);
    if (!showResult) {
      setHasAnswered(true);
      const isCorrect = answer === question.correctAnswer;
      onAnswer(question.id, answer, isCorrect);
    }
  };

  const getOptionStyle = (optionKey: string) => {
    if (!hasAnswered && !showResult) {
      return 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer';
    }

    const isSelected = selectedAnswer === optionKey;
    const isCorrect = optionKey === question.correctAnswer;

    if (showResult) {
      if (isCorrect) {
        return 'bg-green-50 border-green-200 text-green-800';
      }
      if (isSelected && !isCorrect) {
        return 'bg-red-50 border-red-200 text-red-800';
      }
      return 'bg-gray-50 border-gray-200 text-gray-600';
    }

    if (isSelected) {
      return 'bg-blue-50 border-blue-300 text-blue-800';
    }

    return 'bg-gray-50 border-gray-200 cursor-not-allowed';
  };

  const getOptionIcon = (optionKey: string) => {
    if (!showResult) return null;

    const isCorrect = optionKey === question.correctAnswer;
    const isSelected = selectedAnswer === optionKey;

    if (isCorrect) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (isSelected && !isCorrect) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Câu {questionNumber}
          </Badge>
          <span>{question.question}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.options?.map((option, index) => {
          const optionKey = String.fromCharCode(65 + index); // A, B, C, D
          return (
            <div
              key={optionKey}
              className={cn(
                'p-4 border rounded-lg transition-all duration-200 flex items-center gap-3',
                getOptionStyle(optionKey)
              )}
              onClick={() => handleAnswerSelect(optionKey)}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-current text-sm font-medium">
                {optionKey}
              </div>
              <span className="flex-1">{option}</span>
              {getOptionIcon(optionKey)}
            </div>
          );
        })}

        {showResult && question.explanation && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">Giải thích:</p>
                <p className="text-yellow-700 text-sm">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

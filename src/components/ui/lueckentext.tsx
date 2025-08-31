'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';

interface BlankItem {
  type: 'blank';
  correctAnswer: string;
}

interface TextItem {
  type?: never;
}

type TextPart = string | BlankItem;

interface LueckentextProps {
  title: string;
  textParts: TextPart[];
}

export function Lueckentext({ title, textParts }: LueckentextProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (blankIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [blankIndex]: value
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getBlankIndex = (partIndex: number): number => {
    let blankCount = 0;
    for (let i = 0; i < partIndex; i++) {
      const part = textParts[i];
      if (typeof part === 'object' && part.type === 'blank') {
        blankCount++;
      }
    }
    return blankCount;
  };

  const renderTextPart = (part: TextPart, partIndex: number) => {
    if (typeof part === 'string') {
      return <span key={partIndex}>{part}</span>;
    }

    if (part.type === 'blank') {
      const blankIndex = getBlankIndex(partIndex);
      const userAnswer = answers[blankIndex] || '';
      const isCorrect = showResults && userAnswer.toLowerCase().trim() === part.correctAnswer.toLowerCase().trim();
      const isIncorrect = showResults && userAnswer && !isCorrect;

      return (
        <span key={partIndex} className="inline-flex items-center">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(blankIndex, e.target.value)}
            disabled={showResults}
            className={`inline-block w-24 h-8 mx-1 text-center ${
              showResults 
                ? isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : isIncorrect 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                : 'border-purple-300 focus:border-purple-500'
            }`}
            placeholder="___"
          />
          {showResults && (
            <span className="ml-1">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : isIncorrect ? (
                <XCircle className="w-4 h-4 text-red-600" />
              ) : null}
            </span>
          )}
        </span>
      );
    }

    return null;
  };

  const totalBlanks = textParts.filter(part => typeof part === 'object' && part.type === 'blank').length;
  const filledBlanks = Object.keys(answers).filter(key => answers[parseInt(key)].trim()).length;
  const correctAnswers = showResults 
    ? Object.keys(answers).filter(key => {
        const blankIndex = parseInt(key);
        const blank = textParts.find((part, partIndex) => 
          typeof part === 'object' && part.type === 'blank' && getBlankIndex(partIndex) === blankIndex
        ) as BlankItem;
        return blank && answers[blankIndex]?.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim();
      }).length 
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-base leading-relaxed">
          {textParts.map((part, index) => renderTextPart(part, index))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {showResults ? (
              <span>
                Kết quả: {correctAnswers}/{totalBlanks} đúng
              </span>
            ) : (
              <span>
                Đã điền: {filledBlanks}/{totalBlanks} chỗ trống
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!showResults ? (
              <Button 
                onClick={handleSubmit}
                disabled={filledBlanks === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Kiểm tra đáp án
              </Button>
            ) : (
              <Button 
                onClick={handleReset}
                variant="outline"
              >
                Làm lại
              </Button>
            )}
          </div>
        </div>

        {showResults && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Đáp án đúng:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {textParts
                .filter((part): part is BlankItem => typeof part === 'object' && part.type === 'blank')
                .map((blank, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      Chỗ trống {index + 1}:
                    </span>
                    <span className="font-medium">{blank.correctAnswer}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

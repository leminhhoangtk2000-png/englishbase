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
            className={`inline-block w-24 h-8 mx-1 text-center text-sm border rounded transition-all duration-200 ${
              showResults 
                ? isCorrect 
                  ? 'border-green-400 bg-green-50 text-green-800' 
                  : isIncorrect 
                    ? 'border-red-400 bg-red-50 text-red-800' 
                    : 'border-gray-300 bg-gray-50'
                : 'border-blue-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 hover:border-blue-400'
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
    <Card className="w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden my-6">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-base font-medium flex items-center gap-3 text-gray-800">
          <span className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold">
            ✏️
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="text-base leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
          {textParts.map((part, index) => renderTextPart(part, index))}
        </div>

        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-blue-700">
            {showResults ? (
              <span className="flex items-center gap-2">
                <strong>Kết quả:</strong> {correctAnswers}/{totalBlanks} đúng
                {correctAnswers === totalBlanks && <span className="text-green-600">✓</span>}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <strong>Tiến độ:</strong> {filledBlanks}/{totalBlanks} chỗ trống
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!showResults ? (
              <Button 
                onClick={handleSubmit}
                disabled={filledBlanks === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
              >
                Kiểm tra đáp án
              </Button>
            ) : (
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-4 py-2 rounded-md"
              >
                Làm lại
              </Button>
            )}
          </div>
        </div>

        {showResults && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              Đáp án đúng:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {textParts
                .filter((part): part is BlankItem => typeof part === 'object' && part.type === 'blank')
                .map((blank, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{blank.correctAnswer}</span>
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
